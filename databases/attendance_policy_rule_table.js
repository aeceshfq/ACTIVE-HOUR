
const { Schema } = require("mongoose");
const _enum = require("../enum");

class attendance_policy_rule_table {
    model = "attendance_policy_rule";
    fields = {
        policyId: {
            type: Schema.Types.ObjectId,
            ref: 'attendance_policy',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: _enum.attendance.policies.rule.type,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            enum: _enum.attendance.policies.rule.unit,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    };
}

module.exports = new attendance_policy_rule_table();
