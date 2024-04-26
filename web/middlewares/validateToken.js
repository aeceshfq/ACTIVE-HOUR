const jwt = require('jsonwebtoken');
const Users = require('../../models/Users');

const validateToken = async (req, res, next) => {
    const token = req.token;
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, async function(err, decoded) {
        if (err) {
            return res.status(200).send({
                "message": "Invalid or expired token",
                "status": "failed",
                "code": "3"
            });
        }
        else{
            req.userId = decoded.data.id;
            var user = await Users.getUser(decoded.data.id);
            if (user?._id) {
                req.user = user;
                next();
            }
            else{
                return res.status(200).send({
                    "message": "User not found",
                    "status": "failed",
                    "code": "3"
                });
            }
        }
    });
 };
 
 module.exports = validateToken;