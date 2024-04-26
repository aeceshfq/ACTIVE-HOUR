const sgMail = require('@sendgrid/mail');
const { EmailValidator } = require('../helpers/StringHelper');
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const SENDGRID_EMAIL_FROM = process.env.SENDGRID_EMAIL_FROM;

async function SendEmail({to, subject, body}){
    if (!to || !EmailValidator(to)) return { error: "to is not email address"};
    const config = {
        to: to, // Change to your recipient
        from: `${process.env.APP_NAME} <${SENDGRID_EMAIL_FROM}>`, // Change to your verified sender
        subject: subject,
        html: body,
    }
    var data = await sendMe(config).catch(e => e);
    return data;
};

async function sendMe(config){
    return new Promise((resolve, reject) => {
        sgMail.send(config)
        .then((response) => {
            resolve(response[0]);
        })
        .catch(error => {
            if (typeof error.toJSON === "function") {
                console.error("<<email error>>", error.toJSON());
                reject(error.toJSON());
            }
            else{
                reject(error);
            }
        });
    })
}

module.exports = SendEmail;