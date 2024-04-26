const config = {
    saltRounds: 10,
    passwordLifeTime: 30, // in days
    otpLifeTime: 15, // in minutes
    restrictedUserStatus: ["BLOCKED", "BANNED", "ARCHIVED"],
    stayLoggedInDuration: {
        value: 60*12, // 12 hours
        type: "MIN" // Possible values: DAYS, HRS, MIN, SEC
    }
};

module.exports = config;