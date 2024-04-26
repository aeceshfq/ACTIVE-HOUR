const express = require('express'), user = express.Router();
//import controllers here
const UserController = require("../controllers/UserController");
const privileges = require("../privileges");
const verifyPermission = require("./middlewares/verifyPermission");
const UserPrivilegesController = require('../controllers/UserPrivilegesController');
const userPrivileges = new UserPrivilegesController();

user.use(require("./middlewares/authMiddleware")); //check for authenticated

user.route("/user_privileges")
.get(verifyPermission(privileges['staff.manage']), userPrivileges.get)
.put(verifyPermission(privileges['staff.manage']), userPrivileges.update)
.post(verifyPermission(privileges['staff.manage']), userPrivileges.create)
.delete(verifyPermission(privileges['staff.manage']), userPrivileges.delete);

user.post("/user_privileges/bulk_create", verifyPermission(privileges['staff.manage']), userPrivileges.bulkCreate);
user.post("/user_privileges/bulk_update_or_insert", verifyPermission(privileges['staff.manage']), userPrivileges.bulkUpdateOrInsert);

user.route("/myaccount")
.get(UserController.myAccount)
.put(UserController.updateUser);

user.route("/users")
.get(verifyPermission(privileges['staff.manage']), UserController.get)
.put(verifyPermission(privileges['staff.manage']), UserController.updateUser)
.delete(verifyPermission(privileges['staff.manage']), UserController.deleteUser);

user.put("/users/update",verifyPermission(privileges['staff.manage']), UserController.updateUserWithPermissions);
user.post("/staff/add",verifyPermission(privileges['staff.manage']), UserController.addStaff);

module.exports = user;