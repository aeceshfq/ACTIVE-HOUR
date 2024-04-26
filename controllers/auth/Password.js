const UserModel = require("../../models/UserModel");
const bcrypt = require("bcryptjs");
const config = require("./config");
const UserAccountSecurityModel = require("../../models/UserAccountSecurityModel");
const DateHelper = require("../../helpers/DateHelper");

const ChangePassword = async (req, res, next) => {
    const { userId, oldPassword, password, confirmPassword } = req.body;

    if (!userId) {
        return res.status(200).send({
            message: "User not foud",
            status: "failed",
            code: "2",
        });
    }

    if (!oldPassword) {
        return res.status(200).send({
            message: "Password is required",
            status: "failed",
            code: "2",
        });
    }

    if (!password) {
        return res.status(200).send({
            message: "New password is required",
            status: "failed",
            code: "2",
        });
    }

    if (!password || password !== confirmPassword) {
        return res.status(200).send({
            message: "Confirmation password does not match",
            status: "failed",
            code: "2",
        });
    }

    var user = await UserModel.findWithPass({_id: userId});

    if (user && user.password && user.password.password) {
        var equals = bcrypt.compareSync(oldPassword, user.password.password);
        if (equals) {
            const salt = await bcrypt.genSalt(config.saltRounds);
            const hash = await bcrypt.hash(password, salt);
            var userUpdated = await UserAccountSecurityModel.updateOneByQuery({userId: userId}, {
                password: hash,
                passwordExpiresOn: DateHelper.NextDueDate(config.passwordLifeTime)
            });
            if (userUpdated?.modifiedCount > 0) {
                return res.status(200).send({
                    message: "Password changed",
                    status: "success",
                    code: "1",
                });
            } else {
                return res.status(200).send({
                    message: "Password changed",
                    status: "success",
                    code: "1",
                });
            }
        } else {
            return res.status(200).send({
                message: "Current password is incorrect",
                status: "failed",
                code: "2",
            });
        }
    } else {
        return res.status(200).send({
            message: "Password is incorrect",
            status: "failed",
            code: "2",
            user
        });
    }
};

const ResetPassword = async (req, res, next) => {
    const { userId, password, confirmPassword } = req.body;
    if (confirmPassword === password && userId) {
        var user = await UserModel.findWithPass({_id: userId});
        if (user && user._id) {
            var userUpdated = await UserAccountSecurityModel.updateOneByQuery({userId: userId}, {
                password: password,
                passwordExpiresOn: DateHelper.NextDueDate(config.passwordLifeTime)
            });
            if (userUpdated?.modifiedCount > 0) {
                return res.status(200).send({
                    message: "password changed",
                    status: "success",
                    code: "1",
                });
            } else {
                return res.status(200).send({
                    message: "could not be updated",
                    status: "failed",
                    code: "2",
                });
            }
        }
        else {
            return res.status(200).send({
                message: "password is incorrect",
                status: "failed",
                code: "2",
            });
        }
    }
    else {
        return res.status(200).send({
            message: "password is incorrect",
            status: "failed",
            code: "2",
        });
    }
};

const Password = {
    ChangePassword, ResetPassword
};

module.exports = Password;
