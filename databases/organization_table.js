
const { Schema } = require("mongoose");
const StringHelper = require("../helpers/StringHelper");
const _enum = require("../enum");
class organization_table {
    model = "organization";
    fields = {
        userId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			immutable: true,
			required: [true, 'userId is required']
        },
        name: {
            type: String,
            unique: true,
            required: true,
            validate: {
                validator: StringHelper.StringValidator,
                message: "Name is required"
            },
            set: function (name) {
                return name.trim(); // Trims whitespace before saving
            },
        },
        legalName: {
            type: String,
            default: null
        },
        legalDocument: {
            type: Object,
            default: null
        },
        businessAddress: {
            type: Object,
            default: null
        },
        employeeRange: {
            type: String,
            enum: _enum.employeeRange,
            default: _enum.employeeRange[0],
        }
    };
}

module.exports = new organization_table;
