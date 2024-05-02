
const { Schema } = require("mongoose");
const _enum = require("../enum");

class attendance_table {
    model = "attendance";
    fields = {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            immutable: true,
        },
        attendanceDate: {
            type: Date,
            required: true,
            immutable: true
        },
        clockInTime: {
            type: Date,
            required: true,
            immutable: true,
        },
        clockOutTime: {
            type: Date,
            default: null,
        },
        breakTime: {
            type: Date,
            default: null,
        },
        breaks: {
            type: Array,
            default: []
        },
        status: {
            type: String,
            enum: _enum.attendance.status,
            default: _enum.attendance.status[0],
            immutable: true,
        },
        statusLabel: {
            type: String,
            default: null
        },
        workingState: {
            type: String,
            enum: _enum.attendance.workingState,
            default: _enum.attendance.workingState[0],
        }
    };
}

module.exports = new attendance_table();
