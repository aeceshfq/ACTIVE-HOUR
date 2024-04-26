const jwt = require('jsonwebtoken');
const UserModel = require("../../models/UserModel");
const UserAccountSecurityModel = require("../../models/UserAccountSecurityModel");
const DateHelper = require("../../helpers/DateHelper");
const AccountActivationEmail = require("../../email/users/AccountActivationEmail");
const AccountActivatedEmail = require("../../email/users/AccountActivatedEmail");
const { EmailValidator, randString } = require("../../helpers/StringHelper");
const config = require("./config");
const bcrypt = require('bcryptjs');
const PasswordResetEmail = require('../../email/users/PasswordResetEmail');
const { DecodeHex, CookiesOptions } = require('../../helpers/AuthHelper');
const { GenerateSessionToken, VerifySession } = require('./Auth');

const Activate = async (req, res, next) => {
    const {
        id,
        otp
    } = req.body;

    var user = await UserModel.findWithPass({_id: id});
   
    if (user && user?._id && user?.password?._id) {
        let isRestricted = config.restrictedUserStatus.findIndex(r => r === user?.status) > -1;
        if (isRestricted) {
            return res.status(201).send({
                status: "failed",
                code: "2",
                message: "Account is active"
            });
        }
        else if(user.status === "ACTIVE"){
            return res.status(201).send({
                status: "failed",
                code: "2",
                message: `Account is ${user.status}`
            });
        }
        else{
            var isExpired = DateHelper.isExpired(user.password.otpExpiresOn);
            if (isExpired) {
                return res.status(200).send({
                    status: "failed",
                    code: "2",
                    message: "OTP session had been expired. Request a new OTP code.",
                    error: {
                        otp: `OTP session had been expired on ${user.password.otpExpiresOn}`
                    }
                });
            }
            else{
                if (user?.password?.otp == otp) {
                    await UserModel.updateOne(user?._id, {
                        status: "ACTIVE",
                        activatedAt: new Date()
                    });
                    await UserAccountSecurityModel.updateOneByQuery({ userId: user?._id }, { 
                        passwordExpiresOn: DateHelper.NextDueDate(config.passwordLifeTime),
                        otp: null,
                        otpExpiresOn: new Date()
                    });
                    await AccountActivatedEmail(user.email);
                    return res.status(200)
                    .send({
                        status: "success",
                        code: "1",
                        message: "Account is activated"
                    });
                }
                else{
                    return res.status(200)
                    .send({
                        status: "failed",
                        code: "2",
                        message: "Invalid OTP"
                    });
                }
            }
        }
    }
    else{
        return res.status(200)
        .send({
            status: "failed",
            code: "2",
            message: "not found"
        });
    }
}

const ResendOTP = async (req, res, next) => {
    const {
        email
    } = req.body;
    if (!email || !EmailValidator(email)) {
        res.status(200)
        .send({
            status: "failed",
            code: "2",
            message: "invalid emaill"
        });
    }
    var data = await SendOTP(email);
    if (data?.error) {
        return res.status(200)
        .send({
            status: "failed",
            code: "2",
            error: data?.error,
            message: data?.error??"error"
        });
    }
    else{
        return res.status(200)
        .send({
            status: "success",
            code: "1",
            message: "An OTP has been sent to the email address you provided."
        });
    }
}

const ForgetPasswordLink = async (req, res, next) => {
    const {
        email
    } = req.body;
    if (!email || !EmailValidator(email)) {
        return res.send({
            status: "failed",
            code: "2",
            message: "invalid emaill address"
        });
    }
    const user = await UserModel.findUser(email);
    if (user && user._id) {
        let isRestricted = config.restrictedUserStatus.findIndex(r => r === user?.status) > -1;
        if (isRestricted) {
            return res.status(200).send({
                "message": `Account is ${user.status}`,
                "status": "failed",
                "code": "3"
            });
        }
        var token = jwt.sign({
            exp: DateHelper.UnixTimestamp(config.stayLoggedInDuration.value, config.stayLoggedInDuration.type),
            data: {
                id: user._id
            }
        }, process.env.JWT_SECRET_TOKEN);

        await PasswordResetEmail(email, user, token);

        return res.send({
            "token": token,
            "status": "success",
            "code": "2",
            "message": `An email has been sent to "${email}".`
        });
    }
    else{
        return res.status(200)
            .send({
                status: "failed",
                code: "2",
                message: "Either the account is invalid or it cannot be found"
            });
    }
}

const SendOTP = async (email, otp) => {
    const user = await UserModel.findUser(email);
    if (user && user._id) {
        if (user.email && otp) {
            await AccountActivationEmail(email, otp);
            return { message: "OTP has been sent to your email address"};
        }
        else{
            var OTP = `${randString(8)}`;
            await UserAccountSecurityModel.updateOneByQuery({ userId: user._id},
            {
                otp: OTP,
                otpExpiresOn: DateHelper.nextDate(config.otpLifeTime)
            });
            await AccountActivationEmail(email, OTP);
            return { message: "OTP has been sent to your email address"};
        }
    }
    else{
        console.log("OTP send error; user not found");
        return { error: "User not found"}
    }
}

const VerifyAccountAndRefreshToken = async (req, res, next) => {
    const sessionId = req.cookies.sessionId;
    const sessionToken = req.cookies.sessionToken;
    if (sessionId && sessionToken) {
        req.token = sessionToken;
        const verify = await VerifySession(sessionToken, sessionId).catch(e => e);
        if (verify?.status === "success" && verify?.user) {
            var userData = await UserModel.findWithUserPrivileges(verify?.user?._id);
            const sessionToken = await GenerateSessionToken(verify?.user, req);
            const cookieOptions = CookiesOptions();
            res.cookie('sessionId', sessionToken.sessionId, cookieOptions);
            res.cookie('sessionToken', sessionToken.token, cookieOptions);
            const response_data = {
                "user": userData,
                "isAuthenticated": true,
                "isVerified": userData.status === "ACTIVE",
                "message": userData.status === "ACTIVE"?"User is valid":"User is invalid",
                "status": "success",
                "code": "1"
            };
            return res.status(200).send(response_data);
        }
        else{
            return res.send(verify);
        }
    }
    else{
        return res.status(200).send({
            "message": "Invalid token",
            "status": "failed",
            "code": "3"
        });
    }
}

const SetNewPassword = async (req, res, next) => {
    const {
        token,
        password,
        confirmPassword
    } = req.body;

    if (!token) {
        return res.status(200).send({
            "message": "missing token",
            "status": "failed",
            "code": "2"
        });
    }

    if (!password) {
        return res.status(200).send({
            "message": "Password is required",
            "status": "failed",
            "code": "2"
        });
    }

    if (!password || (password !== confirmPassword)) {
        return res.status(200).send({
            "message": "confirmation password does not match",
            "status": "failed",
            "code": "2"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, async function (error, decoded) {
        if (error) {
            return res.status(200).send({
                "message": "Invalid token",
                "status": "failed",
                "code": "2"
            });
        }
        else if (decoded) {
            var user = await UserModel.getUser(decoded?.data?.id);
            if (user?._id && user.email) {
                let isRestricted = config.restrictedUserStatus.findIndex(r => r === user?.status) > -1;
                if (isRestricted) {
                    return res.status(200).send({
                        "message": `Account is ${user.status}`,
                        "status": "failed",
                        "code": "3"
                    });
                }
                const hash = bcrypt.hashSync(password, config.saltRounds);
                var saveAccountSecurity = await UserAccountSecurityModel.updateOneOrInsert({userId : user?._id}, {
                    password: hash,
                    userId: user?._id,
                    passwordExpiresOn: DateHelper.NextDueDate(config.passwordLifeTime)
                });
                if (saveAccountSecurity._id) {
                    await UserModel.updateOne(user?._id, {
                        password: saveAccountSecurity._id,
                        status: "ACTIVE",
                        activatedAt: new Date()
                    });
                    return res.status(201).send({
                        data: {
                            firstName: user.firstName,
                            lastName: user.lastName
                        },
                        status: "success",
                        code: "1",
                        message: "Account has been activated"
                    });
                }
                else{
                    return res.status(201).send({
                        status: "failed",
                        code: "2",
                        message: "Server error",
                        error: saveAccountSecurity
                    });
                }
            }
            else {
                return res.status(200).send({
                    "message": "invalid token",
                    "status": "failed",
                    "code": "3"
                });
            }
        }
        else {
            return res.status(200).send({
                "message": "Invalid token",
                "status": "failed",
                "code": "2"
            });
        }
    });

}

const VerifyToken = async (req, res, next) => {
    const token = req.body.token;
    console.log("token", token);
    if (token){
        jwt.verify(token, process.env.JWT_SECRET_TOKEN, async function (error, decoded) {
            if (error) {
                console.log("error", error);
                return res.status(200).send({
                    "message": "Invalid or expired token",
                    "status": "failed",
                    "code": "3"
                });
            }
            else if (decoded) {
                var user = await UserModel.getUser(decoded?.data?.id);
                if (user?._id && user.email) {
                    return res.status(200).send({
                        "data": {
                            firstName: user.firstName,
                            lastName: user.lastName
                        },
                        "message": "User found",
                        "status": "success",
                        "code": "1"
                    });
                }
                else {
                    return res.status(200).send({
                        "message": "Invalid or expired token",
                        "status": "failed",
                        "code": "3"
                    });
                }
            }
            else {
                return res.status(200).send({
                    "message": "Invalid or expired token",
                    "status": "failed",
                    "code": "3"
                });
            }
        });
    }
    else{
        return res.status(200).send({
            "message": "Invalid or expired token",
            "status": "failed",
            "code": "3"
        });
    }
}

const Account = {
    Activate, ResendOTP, SendOTP, ForgetPasswordLink, VerifyAccountAndRefreshToken, SetNewPassword, VerifyToken
};

module.exports = Account;