

const Controller = require("../app/Controller");
const AttendancePolicyModel = require("../models/AttendancePolicyModel");

class AttendancePolicyController extends Controller {
    async get(req, res) {
        let query = {
            organizationId: req.organizationId
        };
        let data = await AttendancePolicyModel.findAll(query);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }

    async update(req, res) {
        if (!req.policyId || !req.body.data) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "{id} and {data} fields are required"
            });
        }
        let data = await AttendancePolicyModel.updateOne(req?.policyId, req.body.data);
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
        req.body.data["organizationId"] = req?.organizationId;
        let data = await AttendancePolicyModel.save(req.body.data);
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
        if (!req.policyId) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "{id} is required"
            });
        }
        let data = await AttendancePolicyModel.deleteOneByQuery({_id: req.policyId, organizationId: req?.organizationId});
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }
}

module.exports = AttendancePolicyController;
