

const Controller = require("../app/Controller");
const OrganizationModel = require("../models/OrganizationModel");

class OrganizationController extends Controller {
    async get(req, res) {
        if (req.query.id) {
            let data = await OrganizationModel.findOne({ id: req.query.id });
            return res.send({
                "status": "success",
                "code": "1",
                "data": data
            });
        }
        else{
            let data = await OrganizationModel.lookup(req);
            return res.send({
                "status": "success",
                "code": "1",
                "data": data
            });
        }
    }

    async update(req, res) {
        if (!req.query.id || !req.body.data) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "{id} and {data} fields are required"
            });
        }
        let data = await OrganizationModel.updateOne(req.query.id, req.body.data);
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
        let data = await OrganizationModel.save(req.body.data);
        if (data?._id) {
            return res.send({
                "status": "success",
                "code": "1",
                "data": data
            });
        }
        return res.send({
            "status": "success",
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
        let data = await OrganizationModel.deleteOne(req.query.id);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }
}

module.exports = OrganizationController;
