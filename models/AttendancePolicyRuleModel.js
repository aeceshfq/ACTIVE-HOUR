
const Model = require("../app/Model");

class AttendancePolicyRuleModel extends Model {
    constructor() {
        super({ db_file_name: "attendance_policy_rule" });
    }
}

module.exports = new AttendancePolicyRuleModel();
