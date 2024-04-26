
const Model = require("../app/Model");

class UserPrivilegeModel extends Model {
    constructor() {
        super({ db_file_name: "user_privileges" });
    }
}

module.exports = new UserPrivilegeModel();
