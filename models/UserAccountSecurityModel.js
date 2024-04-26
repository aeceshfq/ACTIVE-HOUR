const Model = require("../app/Model");

class UserAccountSecurityModel extends Model {

	constructor() {
		super({ db_file_name: "user_account_security" });
	}

}

module.exports = new UserAccountSecurityModel();