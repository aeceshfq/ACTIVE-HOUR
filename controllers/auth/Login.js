const { CookiesOptions } = require("../../helpers/AuthHelper");
const { Login: UserLogin } = require("./Auth");

const Login = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    let response = await UserLogin(email, password, req);
    const { sessionId, token } = response||{};
    const cookieOptions = CookiesOptions();
    res.cookie('sessionId', sessionId, cookieOptions);
    res.cookie('sessionToken', token, cookieOptions);
    return res.send(response);
}

module.exports = Login;