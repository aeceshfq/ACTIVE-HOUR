
const { Schema } = require("mongoose");

class auth_session_table {
    model = "auth_session";
    fields = {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        sessionId: {
            type: Schema.Types.UUID,
            required: true,
            unique: true,
        },
        sessionToken: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["ACCESS_GRANTED", "ACCESS_DENIED", "ACCESS_REVOKED"],
            default: "ACCESS_DENIED"
        },
        statusText: {
            type: String,
        },
        expiredAt: {
            type: Date,
        },
        accessDeniedReason: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        location: {
            type: Object,
        },
        ipAddress: {
            type: String,
        }
    };
}

module.exports = new auth_session_table;
