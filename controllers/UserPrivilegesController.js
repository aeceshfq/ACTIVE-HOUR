const Controller = require("../app/Controller");
const UserPrivilegeModel = require("../models/UserPrivilegeModel");

class UserPrivilegesController extends Controller {
    async get(req, res) {
        let data = await UserPrivilegeModel.getAll({ userId: req.user._id });
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
        let data = await UserPrivilegeModel.updateOne(req.query.id, req.body.data);
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
        try {
            req.body.data["userId"] = req?.user?._id;
        } catch (error) {
            
        }
        let data = await UserPrivilegeModel.save(req.body.data);
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
        let data = await UserPrivilegeModel.deleteOne(req.query.id);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }

    async bulkCreate(req, res){
        let scopes = req.body?.data?.scopes;
        let response = await UserPrivilegeModel.bulkCreate(scopes);
        if (response) {
            return res.send({
                "status": "success",
                "code": "1",
                "data": response
            });
        }
        return res.send({
            "status": "success",
            "code": "2",
            "message": "error",
            "errors": response
        });
    }

    async bulkUpdateOrInsert(req, res){
        let response = await UserPrivilegeModel.bulkUpdateOrInsert(req.body?.data);
        if (response) {
            return res.send({
                "status": "success",
                "code": "1",
                "data": response
            });
        }
        return res.send({
            "status": "success",
            "code": "2",
            "message": "error",
            "errors": response
        });
    }

}

module.exports = UserPrivilegesController;
