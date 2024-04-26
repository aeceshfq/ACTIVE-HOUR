const { Schema, default: mongoose } = require("mongoose");
const Model = require("../app/Model");

class UserModel extends Model {
	constructor() {
		super({
			db_file_name: "users",
			virtuals: [
				{
					name: "fullName",
					get: function () {
						return `${this.firstName??""} ${this.lastName??""}`.trim()
					}
				},
				{
					name: "userId",
					get: function() {
						return this._id;
					}
				}
			],
			watch: async (change) => {
				console.log("change", change);
			}
		});
	}

	async getUser(_id) {
		var user = await this.db.findOne({ _id: _id });
		return user;
	}

	async getUserWithPassword(_id) {
		var user = await this.db.findOne({ _id: _id }).populate("password");
		return user;
	}

	async findUser(email) {
		var user = await this.db.findOne({ email: email }).populate("password");
		return user;
	}

	async findWithPass(query) {
		var user = await this.db.findOne(query).populate("password");
		return user;
	}

	async findWithUserPrivileges(_id) {
		let __id = mongoose.Types.ObjectId(String(_id));
		var user = await this.db.aggregate([
			{
				$match: {
					_id: __id
				},
			},
			{
				$lookup: {
					from: 'user_privileges',
					localField: '_id',
					foreignField: 'userId',
					as: 'privileges',
					let: { userId: '$_id' },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ['$userId', '$$userId'] },
										{ $eq: ['$status', 'GRANTED'] },
									],
								},
							},
						},
						{
							$project: {
								_id: 0,
								scope: 1,
								status: 1,
							},
						},
					],
				},
			},
			{
				$project: {
					"_id": 1,
					"firstName": 1,
					"lastName": 1,
					"email": 1,
					"id": 1,
					"role": 1,
					"status": 1,
					"userId": "$_id",
					"fullName": {
						"$concat": ['$firstName', ' ', '$lastName'], // Concatenate firstName and lastName with a space in between
					},
					"privileges": 1,
				},
			}
		]);
		if (user && typeof user === "object" && user.length > 0) {
			return user[0];
		}
		return user;
	}

}

module.exports = new UserModel();
