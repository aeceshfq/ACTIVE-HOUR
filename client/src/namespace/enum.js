module.exports = {
    user: {
        role: ["SUPER_ADMIN", "OWNER", "EMPLOYEE"],
        status: ["ACTIVE", "INACTIVE", "BLOCKED", "BANNED", "ARCHIVED", "INVITED", "UNVERIFIED"],
        gender: ["MALE", "FEMALE", "OTHER", "NOT_SPECIFIED"],
        privileges: {
            status: ["GRANTED", "REVOKED"]
        }
    },
	attendance: {
		status: ["PRESENT", "ABSENT", "PRESENT_BUT_LATE", "LEAVE", "DAY_OFF"],
		workingState: ["WORKING", "ON_BREAK", "IDLE", "TRAINING", "MEETING", "SIGNED_OUT"],
		policies: {
			rule: {
				type: ['THRESHOLD', 'ACCRUAL', 'OVERTIME'],
				unit: ["MINUTES","HOURS","DAYS","WEEKS","MONTHS","YEARS","SHIFTS","OCCURRENCES","PERCENTAGE","CUSTOM"]
			},
			condition: {
				type: ["TIME", "DAY_OF_THE_WEEK","HOLIDAY","MONTH","DATE_RANGE","EMPLOYMENT_STATUS","CUSTOM"]
			},
			action: {
				type: ["PENALTY","NOTIFICATION","REWARD","ADJUSTMENT","CUSTOM"],
				value: ["DEDUCT_SALARY","SEND_EMAIL_ALERT","GENERATE_WARNING_LETTER","APPLY_DISCIPLINARY_ACTION","UPDATE_ATTENDANCE_RECORD","ASSIGN_ADDITIONAL_WORK","SCHEDULE_COUNSELING_SESSION","PROVIDE_TRAINING","REWARD","NO_ACTION"]
			},
		}
	},
	employeeDesignations: [
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
    currency: ["AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BRL","BSD","BTN","BWP","BYR","BZD","CAD","CDF","CHF","CLP","CNY","COP","CRC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LTL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRO","MUR","MVR","MWK","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SLL","SOS","SRD","STD","SYP","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","USD","UYU","UZS","VEF","VND","VUV","WST","XAF","XCD","XOF","XPF","YER","ZAR","ZMW","ZWL"],
    countries: [
		"Bangladesh", "India", "Pakistan", "United Arab Emirates", "Saudi Arabia"
		// "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
	],
    country_codes: ["AD", "AE", "AF", "AG", "AI", "AL", "AM", "AN", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"],
	employeeRange: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"],
};