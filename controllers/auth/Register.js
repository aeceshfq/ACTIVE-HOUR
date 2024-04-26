const { Register: UserRegister } = require("./Auth");

const Register = async (req, res, next) => {
    const response = await UserRegister(req.body, req);
    return res.send(response);
}

module.exports = Register;