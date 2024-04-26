
const { Schema } = require("mongoose");

class organization_table {
    model = "organization";
    fields = {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        legalName: {
            type: String,
            unique: true,
            required: true,
        },
        businessAddress: {
            type: Object,
            default: null
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        image: {
            type: Object,
            default: null
        }
    };
}

module.exports = new organization_table;
