

const Controller = require("../app/Controller");
const { FormatDate } = require("../helpers/DateHelper");
const AttendanceModel = require("../models/AttendanceModel");
const moment = require("moment");

class AttendanceController extends Controller {

    async get(req, res) {
        let userId = req.user?._id;
        const date = req.query.date?req.query.date:FormatDate(new Date());
        const get_by = req.query.get_by??null;
        if(get_by === "month"){
            const year = new Date().getFullYear();
            const month = req.query.month?req.query.month:new Date().getMonth()+1;
            let matchMonth = parseInt(month);
            if (matchMonth < 9) {
                matchMonth = `0${matchMonth}`;
            }
            let yearMonth = `${year}-${matchMonth}`;
            const daysInMonth = new Date(year, parseInt(matchMonth), 0).getDate();
            const query = {
                userId: userId,
                $expr: {
                    $eq: [{ $dateToString: { format: '%Y-%m', date: '$attendanceDate' } }, yearMonth]
                }
            };
            let attendanceRecords = await AttendanceModel.findAll(query);
            let monthArray = Array.from({length: daysInMonth}, (_, i) => {
                let date = moment(new Date(year, parseInt(month)-1, i+1)).format("YYYY-MM-DD");
                return {
                    date: date,
                    breakMinutes: 0,
                    workingMinutes: 0,
                    status: "IDLE",
                    workingStatus: "IDLE",
                    record: {}
                };
            });

            for (let index = 0; index < attendanceRecords.length; index++) {
                const record = attendanceRecords[index];
                if (record && record.attendanceDate) {
                    const date = moment(new Date(record.attendanceDate)).format("YYYY-MM-DD");
                    let findIndex = monthArray.findIndex(c => c.date == date);
                    if (findIndex > -1) {
                        let workingTimeMS = 0;
                        let breakTimeMS = 0;
                        let clockOutToday = new Date();
                        if (moment(new Date()).format("YYYY-MM-DD") !== moment(record.attendanceDate).format("YYYY-MM-DD")) {
                            let attd = new Date(record.attendanceDate);
                            clockOutToday = new Date(attd.getFullYear(), attd.getMonth(), attd.getDate(), 23, 59, 59, 999);
                        }
                        let clockOutTime = record.clockOutTime?new Date(record.clockOutTime): clockOutToday;
                        if (clockOutTime) {
                            if (record.breaks && record.breaks.length) {
                                for (let binx = 0; binx < record.breaks.length; binx++) {
                                    const breakTime = record.breaks[binx];
                                    if (breakTime.clockInTime && breakTime.clockOutTime) {
                                        breakTimeMS += new Date(breakTime.clockOutTime) - new Date(breakTime.clockInTime);
                                    }
                                }
                            }
                            workingTimeMS = clockOutTime - new Date(record.clockInTime) - breakTimeMS;
                        }
                        monthArray[findIndex]["workingMinutes"] = Math.floor(workingTimeMS / (1000 * 60));
                        monthArray[findIndex]["breakMinutes"] = Math.floor(breakTimeMS / (1000 * 60));
                        monthArray[findIndex]["status"] = record.status;
                        monthArray[findIndex]["workingStatus"] = record.workingStatus;
                        monthArray[findIndex]["record"] = {
                            attendanceDate: record.attendanceDate,
                            clockOutTime: record.clockOutTime,
                            clockInTime: record.clockInTime,
                            breakTime: record.breakTime,
                            breaks: record.breaks,
                        };
                    }
                }
            }

            return res.send({
                "status": "success",
                "code": "1",
                "data": monthArray,
                "yearMonth": yearMonth
            });
        }

        if (!userId) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "User not found"
            });
        }
    
        let query = {userId};
        if (date) {
            query = {...query, ...{
                $expr: {
                    $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$attendanceDate' } }, date]
                }
            }};
        }
        let data = await AttendanceModel.findOne(query);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data,
            date: date,
            query: query,
        });
    }

    async clockInTime(req, res) {
        const {
            attendanceDate, userId, clockInTime
        } = req.body;
        if (!userId || !attendanceDate || !clockInTime) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "Invalid request format"
            });
        }
        let query = {userId};
        if (attendanceDate) {
            query = {...query, ...{
                attendanceDate: { $eq: attendanceDate }
            }};
        }
        let data = await AttendanceModel.updateOneOrInsert(query, {
            userId: userId,
            attendanceDate: attendanceDate,
            clockInTime: clockInTime
        });
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }

    async clockOutTime(req, res) {
        const {
            attendanceDate, userId, clockOutTime
        } = req.body;
        if (!userId || !attendanceDate || !clockOutTime) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "Invalid request format"
            });
        }
        let query = {userId};
        if (attendanceDate) {
            query = {...query, ...{
                attendanceDate: { $eq: attendanceDate }
            }};
        }
        let data = await AttendanceModel.updateOneOrInsert(query, {
            clockOutTime: clockOutTime,
            workingState: "SIGNED_OUT"
        });
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }

    async updateStatus(req, res) {
        const {
            attendanceDate, userId, workingState, dateTime
        } = req.body;
        if (!userId || !attendanceDate || !workingState || !dateTime) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "Invalid request format"
            });
        }
        let query = {userId};
        if (attendanceDate) {
            query = {...query, ...{
                attendanceDate: { $eq: attendanceDate }
            }};
        }
        let update = {
            workingState: workingState
        };
        if (workingState === "ON_BREAK") {
            update = {...update, ...{
                breakTime: dateTime
            }}
        }
        else if(workingState === "WORKING"){
            let att = await AttendanceModel.findOne(query);
            if (att?.breakTime) {
                update = {...update, ...{
                    breakTime: null,
                    $push: {
                        breaks: {
                            clockInTime: att?.breakTime,
                            clockOutTime: new Date(dateTime)
                        }
                    }
                }}
            }
        }
        let data = await AttendanceModel.updateOneOrInsert(query, update);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }

    async update(req, res) {
        const {
            attendanceDate, clockInTime, userId, breakTime
        } = req.body;

        if (!userId) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "User not found"
            });
        }
        let query = {userId};
        if (attendanceDate) {
            query = {...query, ...{
                attendanceDate: { $eq: attendanceDate }
            }};
        }
        let data = await AttendanceModel.updateOneOrInsert(query, req.body);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }
}

module.exports = AttendanceController;
