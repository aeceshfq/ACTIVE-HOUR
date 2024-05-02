const express = require('express'), web = express.Router();

web.use("/auth/", require("./auth"));

web.use("/user/", require("./user"));
web.use("/api/", require("./api"));

web.use("/api/", require("./api"));
web.use("/attendance/", require("./attendance"));


module.exports = web;