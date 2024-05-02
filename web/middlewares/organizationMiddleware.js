const OrganizationModel = require("../../models/OrganizationModel");

const organizationMiddleware = async(req, res, next) => {
    try {
        const organizationId = req.query?.organizationId??req?.organizationId;
        let OrganizationResponse = await OrganizationModel.get(organizationId);
        if (OrganizationResponse && OrganizationResponse?._id) {
            req["organization"] = OrganizationResponse;
            req["organizationId"] = OrganizationResponse?._id;
            return next();
        }
    } catch (error) {
        return res.send({
            status: 'error',
            code: "1",
            message: "Server error",
            errors: error.message
        });
    }
    return res.send({
        status: 'error',
        code: "1",
        message: "Invalid request",
        errors: [
            "Missing organization ID"
        ]
    });
}

module.exports = {
    organizationMiddleware
};