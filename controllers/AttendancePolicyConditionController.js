

const Controller = require("../app/Controller");
const AttendancePolicyConditionModel = require("../models/AttendancePolicyConditionModel");

class AttendancePolicyConditionController extends Controller {
    async get(req, res) {
        let query = {
            ruleId: req.ruleId,
        };
        let data = await AttendancePolicyConditionModel.findAll(query);
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
        req.body.data["ruleId"] = req?.ruleId;
        let data = await AttendancePolicyConditionModel.updateOne(req.query.id, req.body.data);
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
        req.body.data["ruleId"] = req?.ruleId;
        let data = await AttendancePolicyConditionModel.save(req.body.data);
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
            "message": data?.message,
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
        let data = await AttendancePolicyConditionModel.deleteOneByQuery({_id:req.query.id, ruleId: req?.ruleId});
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }
}

module.exports = AttendancePolicyConditionController;
