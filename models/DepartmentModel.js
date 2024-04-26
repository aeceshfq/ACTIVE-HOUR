
const Model = require("../app/Model");

class DepartmentModel extends Model {
    constructor() {
        super({ db_file_name: "department" });
    }
}

module.exports = new DepartmentModel();
