

const Controller = require("../app/Controller");
const AttendanceModel = require("../models/AttendanceModel");

class AttendanceController extends Controller {
    async get(req, res) {
        let userId = req.user?._id;
        if (!userId) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "User not found"
            });
        }
        let query = {userId};
        if (req.query.date) {
            query = {...query, ...{
                $expr: {
                    $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$attendanceDate' } }, req.query.date]
                }
            }};
        }
        let data = await AttendanceModel.findOne(query);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
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
                $expr: {
                    $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$attendanceDate' } }, attendanceDate]
                }
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
                $expr: {
                    $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$attendanceDate' } }, attendanceDate]
                }
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
                $expr: {
                    $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$attendanceDate' } }, attendanceDate]
                }
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
                $expr: {
                    $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$attendanceDate' } }, attendanceDate]
                }
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
