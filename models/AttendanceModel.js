
const Model = require("../app/Model");

class AttendanceModel extends Model {
    constructor() {
        super({
            db_file_name: "attendance",
        });
    }
}

module.exports = new AttendanceModel();
