const { CookiesOptions } = require("../../helpers/AuthHelper");
const { Logout: UserLogout } = require("./Auth");

const Logout = async (req, res, next) => {
    let response = await UserLogout(req);
    const cookieOptions = CookiesOptions();
    res.cookie('sessionId', "0", cookieOptions);
    res.cookie('sessionToken', "0", cookieOptions);
    return res.send(response);
}

module.exports = Logout;