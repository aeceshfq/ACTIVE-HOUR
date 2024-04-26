const verifyRole = (role) => {
    return async (req, res, next) => {
        var user = req.user;
        if (user?.role === role) {
            next();
        }
        else{
            return res.status(200).send({
                "message": "Access denied: insufficient permissions for the requested action.",
                "status": "failed",
                "code": "4"
            });
        }
    }
};
 
module.exports = verifyRole;