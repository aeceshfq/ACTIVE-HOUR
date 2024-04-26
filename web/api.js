const express = require('express'), api = express.Router();

const AttendanceController = require('../controllers/AttendanceController');
const DepartmentController = require('../controllers/DepartmentController');

const Attendance = new AttendanceController();
const Department = new DepartmentController();

api.use(require("./middlewares/authMiddleware")); //check for authenticated

api.get('/attendance', Attendance.get);
api.post('/attendance/signin', Attendance.clockInTime);
api.post('/attendance/signout', Attendance.clockOutTime);
api.post('/attendance/status', Attendance.updateStatus);

module.exports = api;