const { Schema } = require("mongoose");
const _enum = require("../enum");

class user_privileges_table {
	model = "user_privileges";
	fields = {
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			immutable: true,
			required: [true, 'userId is required']
		},
		scope: {
			type: String,
			enum: _enum.user.privileges.scope,
			required: [true, 'value is required']
		},
		status: {
			type: String,
			enum: _enum.user.privileges.status,
			default: "GRANTED"
		}
	};
}

module.exports = new user_privileges_table();