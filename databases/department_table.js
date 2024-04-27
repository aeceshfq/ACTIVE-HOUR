
const { Schema } = require("mongoose");

class department_table {
    model = "department";
    fields = {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'organization',
            required: true,
			immutable: true,
        },
        name: {
            type: String,
            required: true,
        }
    };
}

module.exports = new department_table;
