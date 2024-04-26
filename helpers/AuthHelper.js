const config = require("../controllers/auth/config");
const DateHelper = require("./DateHelper");

function DecodeHex(decoded){
    return Buffer.from(decoded, 'hex').toString();
}

function EncodeHex(sessionId){
    return Buffer.from(sessionId).toString('hex');
}

function DecodeBase64URL(decoded){
    return Buffer.from(decoded, 'base64url').toString();
}

function EncodeBase64URL(sessionId){
    return Buffer.from(sessionId).toString('base64url');
}

function CookiesOptions(){
    const cookieOptions = {
        httpOnly: true,
        secure: true, // Ensure cookie is sent only over HTTPS
        sameSite: 'Strict', // Restrict cookie to first-party context
        maxAge: DateHelper.Timestamps(config.stayLoggedInDuration.value, config.stayLoggedInDuration.type).milliseconds, // Set expiration time
        // domain: 'example.com', // Optionally restrict cookie to a specific domain
    };
    return cookieOptions;
}

const AuthHelper = {
    EncodeHex, DecodeHex, DecodeBase64URL, EncodeBase64URL, CookiesOptions
}

module.exports = AuthHelper;