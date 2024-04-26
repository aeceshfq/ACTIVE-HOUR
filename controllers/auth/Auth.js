const UserModel = require("../../models/UserModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("./config");
const { v4: uuidv4, validate: validateUUID, parse: parseUUID } = require('uuid');
const DateHelper = require("../../helpers/DateHelper");
const { EmailValidator, randString } = require("../../helpers/StringHelper");
const AuthSessionModel = require("../../models/AuthSessionModel");
const UserAccountSecurityModel = require("../../models/UserAccountSecurityModel");
const scopes = require("../../privileges/scopes");
const AccountActivationEmail = require("../../email/users/AccountActivationEmail");
const UserPrivilegeModel = require("../../models/UserPrivilegeModel");
const { DecodeHex, EncodeBase64URL, EncodeHex, DecodeBase64URL } = require("../../helpers/AuthHelper");

const Login = async (email, password, req) => {
    if (!email || !EmailValidator(email)) {
        return ({
            "message": "Email address is required",
            "status": "failed",
            "code": "2"
        });
    }

    if (!password) {
        return ({
            "message": "password is required",
            "status": "failed",
            "code": "2"
        });
    }

    var user = await UserModel.findUser(email);
    if (user && user?.password && user?._id) {
        var equals = bcrypt.compareSync(password, user.password.password);
        if (equals) {
            let isRestricted = config.restrictedUserStatus.findIndex(r => r === user.status) > -1;
            if (isRestricted) {
                return ({
                    "message": `Account is restricted (STATUS:${user.status})`,
                    "status": "failed",
                    "code": "3"
                });
            }
            else{
                try {
                    const sessionToken = await GenerateSessionToken(user, req);
                    var userData = await UserModel.findWithUserPrivileges(user._id);
                    console.log("User logged in", user.email, user.firstName, user.status, new Date());
                    await UserModel.updateOne(user?._id, {
                        $set: {
                            lastLogin: new Date()
                        }
                    });
                    return ({
                        "message": "Login successful",
                        "status": "success",
                        "code": "1",
                        "user": userData,
                        "token": sessionToken.token,
                        "sessionId": sessionToken.sessionId
                    });
                } catch (error) {
                    console.log("error", error);
                    return ({
                        "message": "Login unsuccessful",
                        "status": "failed",
                        "code": "2",
                    });
                }
            }
        }
        else{
            return ({
                "message": "Email or password is incorrect",
                "status": "failed",
                "code": "2"
            });  
        }
    }
    else{
        return ({
            "message": "Email or password is incorrect",
            "status": "failed",
            "code": "2"
        });  
    }
}

const Register = async (params, req) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    } = params;

    if (!firstName) {
        return ({
            "message": "firstName is required",
            "status": "failed",
            "code": "2"
        });
    }

    if (!email || !EmailValidator(email)) {
        return ({
            "message": "email is required",
            "status": "failed",
            "code": "2"
        });
    }

    if (!password) {
        return ({
            "message": "Password is required",
            "status": "failed",
            "code": "2"
        });
    }

    if (!password || (password !== confirmPassword)) {
        return ({
            "message": "confirmation password does not match",
            "status": "failed",
            "code": "2"
        });
    }

    const count = await UserModel.count({email: email});

    if (Number(count) > 0) {
        return ({
            "message": "email already exists",
            "status": "failed",
            "code": "2"
        });
    }

    const salt = await bcrypt.genSalt(config.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    // req.body[password] = hash;
    var userSaved = await UserModel.save({
        firstName,
        lastName,
        email,
    });

    if (userSaved?._id) {
        var OTP = `${randString(8)}`;
        var saveAccountSecurity = await UserAccountSecurityModel.save({
            password: hash,
            userId: userSaved?._id,
            otp: OTP,
            otpExpiresOn: DateHelper.nextDate(15),
            passwordExpiresOn: DateHelper.NextDueDate(366)
        });
        if (saveAccountSecurity._id) {
            await UserModel.updateOne(userSaved._id, {
                password: saveAccountSecurity._id
            });
            await AccountActivationEmail(email, OTP);
            let data_permissions = [];
            for (let index = 0; index < scopes.length; index++) {
                const scope = scopes[index];
                data_permissions.push({
                    find: {
                        scope: scope,
                        userId: userSaved?._id
                    },
                    update: {
                        scope: scope,
                        status: "GRANTED"
                    }
                })
            }

            await UserPrivilegeModel.deleteMany({
                userId: userSaved?._id,
            });

            await UserPrivilegeModel.bulkUpdateOrInsert(data_permissions);
            
            const loginResponse = await Login(email, password, req);
            return loginResponse;
        }
        else{
            return res.status(201).send({
                status: "failed",
                code: "2",
                message: "Server error",
                error: saveAccountSecurity, saveAccountSecurity
            });
        }
    }
    else{
        return ({
            status: "failed",
            code: "2",
            message: "Server error",
            error: userSaved
        });
    }
}

const GenerateSessionToken = async (user, req) => {
    const userSessionId = req.cookies.sessionId;
    const userSessionToken = req.cookies.sessionToken;
    let userSession = await AuthSessionModel.findOne({
        userId: user?._id,
        sessionId: userSessionId,
        status: "ACCESS_GRANTED"
    });
    console.log("Session Token Expire In", config.stayLoggedInDuration.value, config.stayLoggedInDuration.type);
    if (userSession && userSession?._id) {
        console.log("Utilizing old session id", userSession.sessionId);
        const encodedSessionId = EncodeHex(userSession.sessionId);
        const exp = DateHelper.UnixTimestamp(config.stayLoggedInDuration.value, config.stayLoggedInDuration.type);
        var sessionToken = jwt.sign({
            exp: exp,
            data: encodedSessionId
        }, process.env.JWT_SECRET_TOKEN);
        sessionToken = EncodeBase64URL(sessionToken);
        await AuthSessionModel.updateOne(userSession?._id, {
            sessionToken: sessionToken
        });
        return {
            token: sessionToken,
            sessionId: userSession.sessionId
        };
    }
    else{
        // generate new session 
        console.log("Generating a new session id", new Date());
        const sessionId = uuidv4();
        const encodedSessionId = EncodeHex(sessionId);
        const exp = DateHelper.UnixTimestamp(config.stayLoggedInDuration.value, config.stayLoggedInDuration.type);
        var sessionToken = jwt.sign({
            exp: exp,
            data: encodedSessionId
        }, process.env.JWT_SECRET_TOKEN);
        sessionToken = EncodeBase64URL(sessionToken);
        await AuthSessionModel.save({
            userId: user._id,
            sessionId: sessionId,
            sessionToken: sessionToken,
            status: "ACCESS_GRANTED",
            userAgent: req?.get('User-Agent')
        });
        return {
            token: sessionToken,
            sessionId: sessionId
        };
    }
}

const RemoveSessionToken = async (req) => {
    const userSessionId = req.cookies.sessionId;
    const userSessionToken = req.cookies.sessionToken;
    let userSession = await AuthSessionModel.updateOneByQuery({
        sessionId: userSessionId,
        sessionToken: userSessionToken,
    }, {
        status: "ACCESS_REVOKED",
        expiredAt: new Date(),
        statusText: "User has logged out"
    });
    return {
        userSession,
        token: userSessionToken,
        sessionId: userSessionId
    };
}

const VerifySession = async (sessionToken, sessionId) => {
    return new Promise(async (resolve, reject) => {
        async function _reject(message){
            reject ({
                "message": message??"Invalid request",
                "status": "failed",
                "code": "3",
                "error": [message]
            });
        }
        if (!sessionToken) {
            _reject();
        }
        const decodedSessionToken = DecodeBase64URL(sessionToken);
        jwt.verify(decodedSessionToken, process.env.JWT_SECRET_TOKEN, async function (error, decoded) {
            if (error) {
                await AuthSessionModel.updateOneByQuery({
                    sessionToken: sessionToken,
                    status: "ACCESS_GRANTED"
                }, {
                    status: "ACCESS_REVOKED",
                    expiredAt: new Date()
                });
                _reject();
            }
            else if (decoded) {
                const sessionId = DecodeHex(decoded.data);
                if (validateUUID(sessionId)) {
                    let authSession = await AuthSessionModel.findOne({
                        sessionId: sessionId,
                        status: "ACCESS_GRANTED",
                        sessionToken: sessionToken
                    });
                    if (authSession && authSession?.userId) {
                        var user = await UserModel.getUserWithPassword(authSession?.userId);
                        if (user?._id && user?.password?.password) {
                            let isRestricted = config.restrictedUserStatus.findIndex(r => r === user?.status) > -1;
                            if (isRestricted) {
                                _reject(`Account is restricted (STATUS:${user.status})`);
                            }
                            else{
                                const userData = await UserModel.findWithUserPrivileges(user._id);
                                resolve({
                                    code: "1",
                                    status: "success",
                                    user: userData,
                                });
                            }
                        }
                        else {
                            _reject();
                        }
                    }
                    else{
                        _reject("The current session has expired");
                    }
                }
                else{
                    console.log('Invalid UUID');
                    _reject();
                }
            }
            else {
                _reject();
            }
        });
    });
}

const Logout = async (req) => {
    await RemoveSessionToken(req);
    return {
        status: "success",
        code: "1",
        message: "Logged out"
    };
}

const Account = {
    Login, Register, GenerateSessionToken, VerifySession, Logout
};

module.exports = Account;