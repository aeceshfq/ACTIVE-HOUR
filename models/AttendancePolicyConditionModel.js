
const Model = require("../app/Model");

class AttendancePolicyConditionModel extends Model {
    constructor() {
        super({ db_file_name: "attendance_policy_condition" });
    }
}

module.exports = new AttendancePolicyConditionModel();
