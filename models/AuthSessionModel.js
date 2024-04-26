
const Model = require("../app/Model");

class AuthSessionModel extends Model {
    constructor() {
        super({ db_file_name: "auth_session" });
    }
}

module.exports = new AuthSessionModel();
