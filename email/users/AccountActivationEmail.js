const SendEmail = require("../SendEmail");

const AccountActivationEmail = async (to, code) => {
    var msg = {
        to: to,
        subject: `Activate your account`,
        body:  `
<div style="font-family: Helvetica,Arial,sans-serif;min-width:600px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="${process.env.APP_URL}" style="font-size:1.4em;color: #000000;text-decoration:none;font-weight:600">${process.env.APP_NAME}</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing ${process.env.APP_NAME}. Please use the following OTP to complete your sign-up process. This OTP is valid for 15 minutes.</p>
    <h2 style="margin: 0 auto;width: max-content;padding: 2px 12px;color: #000;border-radius: 4px;letter-spacing: 0.3em;">${code}</h2>
    <p style="font-size:0.9em;">Regards,<br />${process.env.APP_NAME}</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>${process.env.APP_NAME}</p>
    </div>
  </div>
</div>
`
    };
    var response = await SendEmail(msg).catch(error => error);
    return response;
}

module.exports = AccountActivationEmail;