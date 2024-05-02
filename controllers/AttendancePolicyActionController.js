

const Controller = require("../app/Controller");
const AttendancePolicyActionModel = require("../models/AttendancePolicyActionModel");

class AttendancePolicyActionController extends Controller {
    async get(req, res) {
        let query = this.query(req);
        let data = await AttendancePolicyActionModel.findOne(query);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }

    async update(req, res) {
        if (!req.query.id || !req.body.data) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "{id} and {data} fields are required"
            });
        }
        let data = await AttendancePolicyActionModel.updateOne(req.query.id, req.body.data);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }

    async create(req, res) {
        if (!req.body.data) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "{data} is required"
            });
        }
        let data = await AttendancePolicyActionModel.save(req.body.data);
        if (data?._id) {
            return res.send({
                "status": "success",
                "code": "1",
                "data": data
            });
        }
        return res.send({
            "status": "failed",
            "code": "2",
            "message": "error",
            "errors": data
        });
    }

    async delete(req, res) {
        if (!req.query.id) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "{id} is required"
            });
        }
        let data = await AttendancePolicyActionModel.deleteOne(req.query.id);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }
}

module.exports = AttendancePolicyActionController;
