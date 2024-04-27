

const Controller = require("../app/Controller");
const OrganizationModel = require("../models/OrganizationModel");

class OrganizationController extends Controller {
    async get(req, res) {
        let query = this.query(req);
        let data = await OrganizationModel.findOne(query);
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
        let query = this.query(req);
        let data = await OrganizationModel.updateOneByQuery(query, req.body.data);
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
        if (req?.user?._id) {
            try {
                req.body.data["userId"] = req?.user?._id;
            } catch (error) {
                
            }
        }
        console.log("req.body.data", req.body.data);
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
}

module.exports = OrganizationController;
