const express = require('express'), request = express.Router();
const AttendanceController = require('../controllers/AttendanceController');
const AttendancePolicyController = require('../controllers/AttendancePolicyController');
const AttendancePolicyRuleController = require('../controllers/AttendancePolicyRuleController');
const AttendancePolicyConditionModel = require('../controllers/AttendancePolicyConditionController');
const AttendancePolicyActionController = require('../controllers/AttendancePolicyActionController');
const { AttendancePolicyMiddleware, AttendancePolicyRuleMiddleware } = require('./middlewares/attendanceMiddleware');
const { organizationMiddleware } = require('./middlewares/organizationMiddleware');

const Attendance = new AttendanceController();
const AttendancePolicy = new AttendancePolicyController();
const AttendancePolicyRule = new AttendancePolicyRuleController();
const AttendancePolicyCondition = new AttendancePolicyConditionModel();
const AttendancePolicyAction = new AttendancePolicyActionController();

request.use(require("./middlewares/authMiddleware")); //check for authenticated

request.get('/', Attendance.get);
request.post('/signin', Attendance.clockInTime);
request.post('/signout', Attendance.clockOutTime);
request.post('/status', Attendance.updateStatus);

request.route('/policies')
.all(organizationMiddleware)
.get(AttendancePolicy.get)
.post(AttendancePolicy.create)
.put(AttendancePolicyMiddleware, AttendancePolicy.update)
.delete(AttendancePolicyMiddleware, AttendancePolicy.delete);

request.route('/policies/rules')
.all(AttendancePolicyMiddleware)
.get(AttendancePolicyRule.get)
.post(AttendancePolicyRule.create)
.put(AttendancePolicyRule.update)
.delete(AttendancePolicyRule.delete);

request.route('/policies/rules/conditions')
.all(AttendancePolicyRuleMiddleware)
.get(AttendancePolicyCondition.get)
.post(AttendancePolicyCondition.create)
.put(AttendancePolicyCondition.update)
.delete(AttendancePolicyCondition.delete);

request.route('/policies/rules/actions')
.all(AttendancePolicyRuleMiddleware)
.get(AttendancePolicyAction.get)
.post(AttendancePolicyAction.create)
.put(AttendancePolicyAction.update)
.delete(AttendancePolicyAction.delete);

module.exports = request;