
const Model = require("../app/Model");

class AttendancePolicyActionModel extends Model {
    constructor() {
        super({ db_file_name: "attendance_policy_action" });
    }
}

module.exports = new AttendancePolicyActionModel();
