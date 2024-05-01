const scopes = require("../privileges/scopes");

module.exports = {
	user: {
		role: ["SUPER_ADMIN", "OWNER", "EMPLOYEE"],
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
	},
	employeeDesignations: [
		null,
		"CEO", // Chief Executive Officer
		"CFO", // Chief Financial Officer
		"COO", // Chief Operating Officer
		"CTO", // Chief Technology Officer
		"CIO", // Chief Information Officer
		"CHRO", // Chief Human Resources Officer
		"CPO", // Chief Product Officer
		"CDO", // Chief Data Officer
		"CMO", // Chief Marketing Officer
		"CRO", // Chief Revenue Officer
		"CLO", // Chief Legal Officer
		"CISO", // Chief Information Security Officer
		"VP_OF_ENGINEERING", // Vice President of Engineering
		"VP_OF_MARKETING", // Vice President of Marketing
		"VP_OF_SALES", // Vice President of Sales
		"VP_OF_PRODUCT", // Vice President of Product
		"HR_MANAGER", // Human Resources Manager
		"FINANCE_MANAGER", // Finance Manager
		"MARKETING_MANAGER", // Marketing Manager
		"SALES_MANAGER", // Sales Manager
		"OPERATIONS_MANAGER", // Operations Manager
		"IT_MANAGER", // IT Manager
		"ADMINISTRATIVE_ASSISTANT", // Administrative Assistant
		"RECRUITER", // Recruiter
		"INTERN", // Intern
		"JUNIOR_DEVELOPER", // Junior Developer
		"SENIOR_DEVELOPER", // Senior Developer
		"PROJECT_MANAGER", // Project Manager
		"TEAM_LEAD", // Team Lead
		"QA_ENGINEER", // QA Engineer
		"UI/UX_DESIGNER", // UI/UX Designer
		"DEVOPS_ENGINEER", // DevOps Engineer
		"DATA_SCIENTIST", // Data Scientist
		"BUSINESS_ANALYST", // Business Analyst
		"CUSTOMER_SERVICE_REPRESENTATIVE", // Customer Service Representative
		"SUPPORT_SPECIALIST", // Support Specialist
		"COMMUNICATIONS_SPECIALIST" // Communications Specialist
	],
	employeeRange: ["0-10", "11-50", "51-500", "501+"]
};