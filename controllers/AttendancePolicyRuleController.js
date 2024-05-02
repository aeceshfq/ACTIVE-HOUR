

const Controller = require("../app/Controller");
const AttendancePolicyRuleModel = require("../models/AttendancePolicyRuleModel");

class AttendancePolicyRuleController extends Controller {
    async get(req, res) {
        let query = {
            policyId: req.policyId
        };
        let data = await AttendancePolicyRuleModel.findAll(query);
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
        req.body.data["policyId"] = req?.policyId;
        let data = await AttendancePolicyRuleModel.updateOne(req.query.id, req.body.data);
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
        req.body.data["policyId"] = req?.policyId;
        let data = await AttendancePolicyRuleModel.save(req.body.data);
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
        let data = await AttendancePolicyRuleModel.deleteOneByQuery({_id:req.query.id, policyId: req?.policyId});
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }
}

module.exports = AttendancePolicyRuleController;
