const verifyRole = (role = [], message) => {
    return async (req, res, next) => {
        var user = req.user;
        if (role.includes(user?.role)) {
            next();
        }
        else{
            return res.status(200).send({
                "message": message??"Access denied: insufficient permissions for the requested action.",
                "status": "failed",
                "code": "4"
            });
        }
    }
};
 
module.exports = verifyRole;