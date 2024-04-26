const scopes = require("../privileges/scopes");

module.exports = {
	user: {
		role: ["SUPER_ADMIN", "OWNER", "STAFF_MEMBER", "MEMBER"],
		status: ["ACTIVE", "INACTIVE", "BLOCKED", "BANNED", "ARCHIVED", "INVITED", "UNVERIFIED"],
		gender: ["MALE", "FEMALE", "OTHER", "NOT_SPECIFIED"],
		privileges: {
			scope: scopes,
			status: ["GRANTED", "REVOKED"]
		}
	},
	attendance: {
		status: ["PRESENT", "ABSENT", "PRESENT_BUT_LATE", "LEAVE", "DAY_OFF"],
		workingState: ["WORKING", "ON_BREAK", "IDLE", "TRAINING", "MEETING", "SIGNED_OUT"]
	}
};