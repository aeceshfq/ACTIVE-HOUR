const UserModel = require('../../models/UserModel');
const config = require('../../controllers/auth/config');
let userAccountMiddleware = {};

userAccountMiddleware.STATUS = async (req, res, next) => {
    let email = req?.query?.email || req?.body?.data?.email || req?.body?.email;
    if (email) {
        var user = await UserModel.findUser(email);
        if (user?._id && user?.password?.password) {
            let isRestricted = config.restrictedUserStatus.findIndex(r => r === user?.status) > -1;
            if (isRestricted) {
                return res.status(200).send({
                    "message": `Account is restricted (STATUS:${user?.status})`,
                    "status": "failed",
                    "code": "3"
                });
            }
            else {
                req.user = await UserModel.findWithUserPrivileges(user._id);
                next();
            }
        }
        else {
            return res.status(200).send({
                "message": "User not found",
                "status": "failed",
                "code": "3"
            });
        }
    }
    else {
        return res.status(200).send({
            "message": "Unauthorized user",
            "status": "failed",
            "code": "2"
        });
    }
};

module.exports = userAccountMiddleware;