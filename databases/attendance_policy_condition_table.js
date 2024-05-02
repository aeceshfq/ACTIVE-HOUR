
const { Schema } = require("mongoose");
const _enum = require("../enum");

class attendance_policy_condition_table {
    model = "attendance_policy_condition";
    fields = {
        ruleId: {
            type: Schema.Types.ObjectId,
            ref: 'attendance_policy_rule',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: _enum.attendance.policies.condition.type,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    };
}

module.exports = new attendance_policy_condition_table();
