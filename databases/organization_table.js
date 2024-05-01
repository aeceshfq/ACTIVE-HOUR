
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
            set: function (val) {
                return val.trim();
            },
        },
        ownerName: {
            type: String,
            default: null,
            set: function (val) {
                return val.trim();
            },
        },
        businessEmail: {
            type: String,
            default: null,
            validate: {
                validator: StringHelper.EmailValidator,
                message: "Email is invalid"
            },
            set: function (val) {
                return val.trim();
            },
        },
        legalName: {
            type: String,
            default: null,
            set: function (val) {
                return val.trim();
            },
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
