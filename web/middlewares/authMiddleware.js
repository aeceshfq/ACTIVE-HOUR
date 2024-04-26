const { VerifySession } = require("../../controllers/auth/Auth");

const authMiddleware = async (req, res, next) => {
    const sessionId = req.cookies.sessionId;
    const sessionToken = req.cookies.sessionToken;
    if (sessionId && sessionToken) {
        req.token = sessionToken;
        const verifyRequest = await VerifySession(sessionToken, sessionId).catch(e => e);
        if (verifyRequest?.status === "success" && verifyRequest?.user?._id) {
            req.user = verifyRequest?.user;
            req.sessionId = sessionId;
            req.sessionToken = sessionToken;
            next();
        }
        else{
            return res.send(verifyRequest);
        }
    }
    else{
        return res.send({
            "message": "Invalid request",
            "status": "failed",
            "code": "3"
        });
    }
};

module.exports = authMiddleware;