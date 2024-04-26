const express = require("express"), auth = express.Router();
const Account = require("../controllers/auth/Account");
const Login = require("../controllers/auth/Login");
const Logout = require("../controllers/auth/Logout");
const { ChangePassword } = require("../controllers/auth/Password");
const Register = require("../controllers/auth/Register");
const authMiddleware = require("./middlewares/authMiddleware");
const { STATUS } = require("./middlewares/userAccountMiddleware");

auth.post("/register", Register);
auth.post("/login", Login);
auth.post("/logout", Logout);

auth.post("/account/password/update", authMiddleware, ChangePassword);
auth.get("/account/verify_user", Account.VerifyAccountAndRefreshToken);
auth.post("/account/activate", Account.Activate);
auth.post("/account/otp/resend",STATUS, Account.ResendOTP);
auth.post("/account/password/forgot", Account.ForgetPasswordLink);
auth.post("/account/accept_invitation", Account.SetNewPassword);
auth.post("/account/verify_token", Account.VerifyToken);
auth.post("/account/password/create", Account.SetNewPassword);

module.exports = auth;
