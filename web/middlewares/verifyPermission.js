const verifyPermission = (type) => {
    return async (req, res, next) => {
        var user = req.user;
        if (user?.role === "SUPER_ADMIN") {
            next();
        }
        else if (user?.privileges) {
            var index = user?.privileges.findIndex( x => x.scope === type && x.status === "GRANTED" );
            if (index > -1) {
                next();
            }
            else{
                sendError();
            }
        }
        else{
            sendError();
        }

        function sendError(){
            return res.status(200).send({
                "message": "Access denied: insufficient permissions for the requested action.",
                "status": "failed",
                "code": "4"
            });
        }
    }
};
 
 module.exports = verifyPermission;