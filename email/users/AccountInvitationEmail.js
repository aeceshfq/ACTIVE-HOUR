const SendEmail = require("../SendEmail");

const AccountInvitationEmail = async (to, invitedBy, newUser, token) => {
    var msg = {
        to: to,
        subject: `Account invitation`,
        body:  `
Dear ${newUser.firstName},

<p>${invitedBy.firstName}${invitedBy.lastName?` ${invitedBy.lastName}`:""} has invited you to create an account.</p>

${process.env.APP_URL}/auth/invitation?token=${token}

        `
    };
    var response = await SendEmail(msg).catch(error => error);
    return response;
}

module.exports = AccountInvitationEmail;