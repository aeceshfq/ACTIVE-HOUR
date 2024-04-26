const SendEmail = require("../SendEmail");

const PasswordResetEmail = async (to, user, token) => {
    var msg = {
        to: to,
        subject: `Reset your password`,
        body:  `
Dear ${user.firstName},

<p>Here is a link to reset your password. Please note that this link will expire in 15 minutes</p>

${process.env.APP_URL}/auth/reset-password?token=${token}

        `
    };
    var response = await SendEmail(msg).catch(error => error);
    return response;
}

module.exports = PasswordResetEmail;