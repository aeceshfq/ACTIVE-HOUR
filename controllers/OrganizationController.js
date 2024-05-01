

const Controller = require("../app/Controller");
const OrganizationModel = require("../models/OrganizationModel");
const UserModel = require("../models/UserModel");

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
        const user = await UserModel.findOne({ _id: req?.user?._id });
        if (!user) {
            return res.send({
                "status": "failed",
                "code": "3",
                "message": "User not found"
            });
        }
        let hasCounts = await OrganizationModel.count({
            $or: [
                {
                    _id: user?.organizationId
                },{
                    userId: user?._id
                },
            ]
        });
        if (hasCounts > 0) {
             let organization = await OrganizationModel.findOne({
                $or: [
                    {
                        _id: user?.organizationId
                    },{
                        userId: user?._id
                    },
                ]
            });
            await UserModel.updateOne(req?.user?._id, {
                organizationId: organization?._id
            });
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "The organization has already been created."
            });
        }
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
        let data = await OrganizationModel.save(req.body.data);
        if (data?._id) {
            await UserModel.updateOne(req?.user?._id, {
                organizationId: data?._id
            });
            return res.send({
                "status": "success",
                "code": "1",
                "data": data
            });
        }
        return res.send({
            "status": "failed",
            "code": "2",
            "message": "Server error",
            "errors": data
        });
    }
}

module.exports = OrganizationController;
