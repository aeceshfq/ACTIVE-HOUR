const { Schema } = require("mongoose");
const _enum = require("../enum");
const StringHelper = require("../helpers/StringHelper");

class users_table {
    model = "users";
    fields = {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            validate: {
                validator: StringHelper.NameValidator,
                message: "First name is invalid"
            },
            set: function (name) {
                return name.trim(); // Trims whitespace before saving
            },
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            validate: {
                validator: StringHelper.NameValidator,
                message: "Last name is invalid"
            },
            set: function (name) {
                return name.trim(); // Trims whitespace before saving
            },
        },
        email: {
            type: String,
            unique: [true, "Email address already exist"],
            required: [true, "Email address is required"],
            validate: {
                validator: StringHelper.EmailValidator,
                message: "Invalid email address"
            },
            immutable: true,
            lowercase: true,
            set: function (email) {
                return email.trim(); // Trims whitespace before saving
            },
            get: function (email) {
                return email.toLowerCase(); // Converts email to uppercase when retrieved
            },
        },
        password: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'user_account_security',
            select: false,
        },
        phone: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            enum: _enum.user.gender,
            default: _enum.user.gender[3],
            description: `must be ${_enum.user.gender.toString()}`
        },
        role: {
            type: String,
            enum: _enum.user.role,
            default: _enum.user.role[1],
            description: `must be ${_enum.user.role.toString()}`
        },
        designation: {
            type: String,
            enum: _enum.employeeDesignations,
            default: _enum.employeeDesignations[0],
            description: `must be ${_enum.employeeDesignations.toString()}`
        },
        introStatus: {
            type: String,
            default: null
        },
        status: {
            type: String,
            enum: _enum.user.status,
            default: _enum.user.status[6],
            description: `must be ${_enum.user.status.toString()}`
        },
        activatedAt: {
            type: Date,
            default: null
        },
        invitedBy: {
            type: Schema.Types.ObjectId,
            immutable: true
        },
        lastLogin: {
            type: Date,
            default: null
        },
        hireDate: {
            type: Date,
            default: null
        },
        dateOfBirth: {
            type: Date,
            default: null
        },
        departmentId : {
            type: Schema.Types.ObjectId,
            ref: 'department',
            default: null
        },
        organizationId : {
            type: Schema.Types.ObjectId,
            ref: 'organization',
            default: null
        }
    };
}

module.exports = new users_table();