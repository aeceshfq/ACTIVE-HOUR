const { Schema } = require("mongoose");

class user_account_security_table {
    model = "user_account_security";
    fields = {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            unique: [true, "userId already exist"],
            required: [true, "userId is required"]
        },
        password: {
            type: String,
            default: null
        },
        resetPassword: {
            type: String,
            default: null
        },
        passwordExpiresOn: {
            type: Date,
            default: null
        },
        otpExpiresOn: {
            type: Date,
            default: null
        },
        otp: {
            type: String,
            default: null
        },
        requiredOTP: {
            type: Boolean,
            default: null
        }
    };
}

module.exports = new user_account_security_table();