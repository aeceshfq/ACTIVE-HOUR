const AttendancePolicyModel = require("../../models/AttendancePolicyModel");
const AttendancePolicyRuleModel = require("../../models/AttendancePolicyRuleModel");

const AttendancePolicyMiddleware = async(req, res, next) => {
    let errors = [];
    try {
        const policyId = req.query?.policyId??req?.policyId;
        if (!policyId) errors.push("Missing policy ID");
        let policyResponse = await AttendancePolicyModel.get(policyId);
        if (policyResponse && policyResponse?._id) {
            req["policy"] = policyResponse;
            req["policyId"] = policyResponse?._id;
            return next();
        }
        else{
            return res.send({
                status: 'failed',
                code: "1",
                message: "Not found",
                errors: ["Not found"]
            });
        }
    } catch (error) {
        return res.send({
            status: 'failed',
            code: "1",
            message: "Server error",
            errors: error.message
        });
    }
}

const AttendanceRuleMiddleware = async(req, res, next) => {
    let errors = [];
    try {
        const policyId = req.query?.policyId??req?.policyId;
        const ruleId = req.query?.policyId??req?.ruleId;
        if (!policyId) errors.push("Policy ID invalid");
        if (!ruleId) errors.push("Rule ID invalid");
        let policyResponse = await AttendancePolicyModel.get(policyId);
        let ruleResponse = await AttendancePolicyRuleModel.findOne({policyId});
        if (policyResponse && policyResponse?._id) {
            req["policy"] = policyResponse;
            req["policyId"] = policyResponse?._id;
            req["rule"] = ruleResponse;
            req["ruleId"] = ruleResponse?._id;
            return next();
        }
        else{
            return res.send({
                status: 'failed',
                code: "1",
                message: "Not found",
                errors: ["Not found"]
            });
        }
    } catch (error) {
        return res.send({
            status: 'failed',
            code: "1",
            message: "Server error",
            errors: error.message
        });
    }
}

module.exports = {
    AttendancePolicyMiddleware, AttendanceRuleMiddleware
};