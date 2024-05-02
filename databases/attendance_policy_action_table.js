
const { Schema } = require("mongoose");
const _enum = require("../enum");

class attendance_policy_action_table {
    model = "attendance_policy_action";
    fields = {
        ruleId: {
            type: Schema.Types.ObjectId,
            ref: 'attendance_policy_rule',
            required: true,
        },
        type: {
            type: String,
            enum: _enum.attendance.policies.action.type,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        threshold: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    };
}

module.exports = new attendance_policy_action_table();
