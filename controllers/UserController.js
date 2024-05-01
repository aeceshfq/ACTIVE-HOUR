const { Schema } = require("mongoose");
const AccountInvitationEmail = require("../email/users/AccountInvitationEmail");
const DateHelper = require("../helpers/DateHelper");
const StringHelper = require("../helpers/StringHelper");
const { EmailValidator } = require("../helpers/StringHelper");
const UserPrivilegeModel = require("../models/UserPrivilegeModel");
const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const config = require("./auth/config");
const _enum = require("../enum");
const { InviteUser } = require("./auth/Auth");

class UserController {

    get = async (req, res) => {
        const _id = req.query.id;
        if (_id) {
            if (req.query.type === "privileges") {
                var data = await UserModel.findWithUserPrivileges(_id);
                return res.send({
                    data: data,
                    status: "success",
                    code: "1"
                });
            }
            else{
                var data = await UserModel.findOne({_id: _id});
                return res.send({
                    data: data,
                    status: "success",
                    code: "1"
                });
            }
        }
        else{
            let query = {
                email: {
                    "$ne": req.user.email
                }
            };
            if (req?.user?.role !== "SUPER_ADMIN" && req?.user?.role !== "ADMIN") {
                query["role"] = {
                    "$ne": "SUPER_ADMIN"
                }
            }
            var data = await UserModel.paginate(req, query);
            return res.send({
                data: data,
                status: "success",
                code: "1"
            });
        }
        
    }

    myAccount = async (req, res, next) => {
        if (req.user && req.user?._id) {
            var data = await UserModel.findOne({_id: req.user._id})
            return res.send({
                data: data,
                status: "success",
                code: "1"
            });
        }
        else{
            return res.send({
                message: "not found",
                status: "failed",
                code: "2"
            });
        }
    }
    
    updateUser = async (req, res, next) => {
        const {
            firstName,
            lastName,
            phone
        } = req.body;

        if (firstName && (!StringHelper.NameValidator(firstName))) {
            return res.status(200).send({
                message: "First name is invalid",
                status: "failed",
                code: "2"
            });
        }
        if (lastName && (!StringHelper.NameValidator(lastName))) {
            return res.status(200).send({
                message: "Last name is invalid",
                status: "failed",
                code: "2"
            });
        }
        try {
            delete req.body["email"];
            delete req.body["password"];
        } catch (error) { }
        var updated = await UserModel.updateOne(req.user._id, req.body);
        if (updated?.modifiedCount > 0) {
            return res.send({
                data: updated,
                status: "success",
                code: "1",
                message: "User account has been updated",
            });
        }
        else{
            return res.send({
                message: "User account could not be updated",
                status: "failed",
                code: "2"
            });
        }
    }
    
    deleteUser = async (req, res, next) => {
        var deleted = await UserModel.deleteOne(req.user._id);
        if (deleted?.modifiedCount > 0) {
            return res.send({
                data: deleted,
                status: "success",
                code: "1"
            });
        }
        else{
            return res.send({
                message: "Could not be updated",
                status: "failed",
                code: "2"
            });
        }
    }

    addStaff = async (req, res, next) => {
        const response = await InviteUser(req);
        return res.send(response);
    }

    updateUserWithPermissions = async (req, res, next) => {
        const {
            firstName,
            lastName,
            email,
            permissions,
            userId,
            role,
            status
        } = req.body;

        if (!firstName || firstName.trim() === "") {
            return res.status(200).send({
                "message": "First name is required",
                "status": "failed",
                "code": "2"
            });
        }

        if (!StringHelper.containsOnlyAlpha(firstName)) {
            return res.status(200).send({
                "message": "First name is invalid",
                "status": "failed",
                "code": "2"
            });
        }

        if (!lastName || lastName.trim() === "") {
            return res.status(200).send({
                "message": "Last name is required",
                "status": "failed",
                "code": "2"
            });
        }

        if (lastName && !StringHelper.containsOnlyAlpha(lastName)) {
            return res.status(200).send({
                "message": "Last name is invalid",
                "status": "failed",
                "code": "2"
            });
        }

        if (!email || email.trim() === "") {
            return res.status(200).send({
                "message": "Email address is required",
                "status": "failed",
                "code": "2"
            });
        }

        if (!EmailValidator(email)) {
            return res.status(200).send({
                "message": "Invalid email address",
                "status": "failed",
                "code": "2"
            });
        }

        const count = await UserModel.count({_id: userId});

        if (Number(count) === 0) {
            return res.status(200).send({
                "message": "Account not found",
                "status": "failed",
                "code": "404"
            });
        }

        await UserModel.updateOneByQuery({
            _id: userId,
            email: email
        }, req.body);

        let data_permissions = [];
        if (permissions && typeof permissions === "object") {
            for (let index = 0; index < permissions.length; index++) {
                const scope = permissions[index];
                data_permissions.push({
                    find: {
                        scope: scope,
                        userId: userId
                    },
                    update: {
                        scope: scope,
                        status: "GRANTED"
                    }
                })
            }
        }

        await UserPrivilegeModel.deleteMany({
            userId: userId,
        });

        await UserPrivilegeModel.bulkUpdateOrInsert(data_permissions);
        
        return res.send({
            "status": "success",
            "code": "1",
            "message": `Account has been updated`
        });
    }
}

module.exports = new UserController;