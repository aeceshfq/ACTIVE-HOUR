
const Model = require("../app/Model");

class OrganizationModel extends Model {
    constructor() {
        super({ db_file_name: "organization" });
    }
}

module.exports = new OrganizationModel();
