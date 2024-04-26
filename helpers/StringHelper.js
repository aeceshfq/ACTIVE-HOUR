function generateRandom(length = 6, type, uppercase) {
    let charset = '';

    if (type === 'alpha') {
        charset = 'abcdefghijklmnopqrstuvwxyz';
    } else if (type === 'numeric') {
        charset = '0123456789';
    } else {
        charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    }

    if (uppercase) {
        charset = charset.toUpperCase();
    }

    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
}

function randNumber(length = 6) {
    return generateRandom(length, "numeric");
}

function randString(length = 6, uppercase) {
    return generateRandom(length, "mixed", uppercase);
}

function randAlpha(length = 6) {
    return generateRandom(length, "alpha");
}

function HasAlphanumericMix(value) {
    // Regular expression to check for at least one letter and one digit
    const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
    return alphanumericRegex.test(value);
}

function EmailValidator(value) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(value);
}

function containsOnlyAlpha(string) {
    // Regular expression to match only alphabetical characters
    const alphaRegex = /^[a-zA-Z]+$/;

    // Test the input string against the regular expression
    return alphaRegex.test(string);
}

function containsOnlyNumeric(string) {
    // Regular expression to match only numeric characters
    const numericRegex = /^[0-9]+$/;

    // Test the input string against the regular expression
    return numericRegex.test(string);
}

function isStrongPassword(password) {
    // Check password length (at least 8 characters)
    if (password.length < 8) {
        return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return false;
    }

    // Check for at least one numeric digit
    if (!/[0-9]/.test(password)) {
        return false;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
        return false;
    }

    // All criteria passed; it's a strong password
    return true;
}

function NameValidator(name) {
    if (!name || name.trim() === "") return false;
    if (!containsOnlyAlpha(name)) return false;
    if (name.length < 2) return false;
    return true;
}

function isValidPhoneNumber(phoneNumber, countryCode) {
    const { isValidNumber, parsePhoneNumberFromString } = require('libphonenumber-js');
    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
    console.log(isValidNumber(parsedPhoneNumber));
    return parsedPhoneNumber ? isValidNumber(parsedPhoneNumber) : false;
}

function StringToNumber(string = 0, precision = 2){
    let a = String(string).replace(/[^0-9.]/g, "");
    if (!isNaN(a)) {
        return ParseNumber(a, 0, precision)
    }
    return 0;
}

function ParseNumber(value, default_value = 0, fixed = null){
    let a = String(value).replace(/[^0-9.]/g, "");
    if (fixed === null && a.indexOf(".") > -1) {
        fixed = String(a.split(".")?.[1]).length;
    }
    if (!isNaN(fixed)) {
        a = Number(a??0).toFixed(fixed)??0;
    }
    if (a && !isNaN(a)) {
        return Number(a);
    }
    return Number(default_value??0);
}

function moneyFormat(number, currency = "$ "){
    return `${currency}${ParseNumber(number, 0, 2)}`
}

function ExtractSectionFromHTML(htmlContent) {
    return "";
}

function urlString(inputString) {
  return String(inputString ?? '')
    .replace(/\s+/g, '-')  // Collapse multiple spaces to a single hyphen
    .replace(/[^\w\s.-]/g, '');  // Remove all special characters except dots
}

const StringHelper = {
    randNumber, randString, randAlpha, HasAlphanumericMix, EmailValidator, containsOnlyAlpha, containsOnlyNumeric, isStrongPassword, NameValidator, isValidPhoneNumber, StringToNumber, ExtractSectionFromHTML, urlString, ParseNumber, moneyFormat
}

module.exports = StringHelper;