const express = require('express'), web = express.Router();

web.use("/auth/", require("./auth"));

web.get("/ping", async function(req, res){
    return res.send("Muhammad Shafiq");
});

web.post("/ping", async function(req, res){
    return res.send("Muhammad Shafiq");
});

web.use("/user/", require("./user"));
web.use("/api/", require("./api"));

module.exports = web;