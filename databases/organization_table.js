
const { Schema } = require("mongoose");
const StringHelper = require("../helpers/StringHelper");
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
