const express = require('express'), api = express.Router();

const AttendanceController = require('../controllers/AttendanceController');
const DepartmentController = require('../controllers/DepartmentController');
const OrganizationController = require('../controllers/OrganizationController');
const verifyRole = require('./middlewares/verifyRole');

const Attendance = new AttendanceController();
const Department = new DepartmentController();
const Organization = new OrganizationController();

api.use(require("./middlewares/authMiddleware")); //check for authenticated

api.get('/attendance', Attendance.get);
api.post('/attendance/signin', Attendance.clockInTime);
api.post('/attendance/signout', Attendance.clockOutTime);
api.post('/attendance/status', Attendance.updateStatus);

const errorMessage = "Only business owners can create an organization";
api.route("/organization")
.get(verifyRole("OWNER",errorMessage), (req, res) => Organization.get(req, res))
.post(verifyRole("OWNER",errorMessage), (req, res) => Organization.create(req, res))
.put(verifyRole("OWNER",errorMessage), (req, res) => Organization.update(req, res));




module.exports = api;