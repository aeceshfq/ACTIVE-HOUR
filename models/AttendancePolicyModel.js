
const Model = require("../app/Model");

class AttendancePolicyModel extends Model {
    constructor() {
        super({ db_file_name: "attendance_policy" });
    }
}

module.exports = new AttendancePolicyModel();
