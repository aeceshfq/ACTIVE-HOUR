const express = require('express'), api = express.Router();

const OrganizationController = require('../controllers/OrganizationController');
const verifyRole = require('./middlewares/verifyRole');

const Organization = new OrganizationController();

api.use(require("./middlewares/authMiddleware")); //check for authenticated

const errorMessage = "Only business owners can create an organization";

api.route("/organization")
.get(verifyRole(["OWNER"], errorMessage), (req, res) => Organization.get(req, res))
.post(verifyRole(["OWNER"], errorMessage), (req, res) => Organization.create(req, res))
.put(verifyRole(["OWNER"], errorMessage), (req, res) => Organization.update(req, res));


module.exports = api;