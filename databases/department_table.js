
const { Schema } = require("mongoose");

class department_table {
    model = "department";
    fields = {
        name: {
            type: String,
            default: null
        }
    };
}

module.exports = new department_table;
