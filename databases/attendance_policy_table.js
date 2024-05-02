
const { Schema } = require("mongoose");

class attendance_policy_table {
    model = "attendance_policy";
    fields = {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'organization',
            required: true,
            immutable: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    };
}

module.exports = new attendance_policy_table();


/**
Certainly! Let's consider a real-time example where these attendance policies apply within an organization:

**Example Scenario:**

**Organization:** XYZ Corporation

**Attendance Policy:** 
- **Policy Name:** Late Arrival Policy
- **Description:** This policy governs employee punctuality and late arrivals to the workplace.
- **Rule:** Late Arrival Threshold
   - **Rule Type:** Threshold
   - **Rule Value:** 15 minutes
   - **Rule Unit:** Minutes
- **Action:** Penalty for Late Arrivals
   - **Action Type:** Deduct Salary
   - **Action Value:** 1 day's salary deduction
   - **Action Threshold:** 3 occurrences within a month

**Practical Application:**

1. **Policy Enforcement:**
   - If an employee arrives late to work by more than 15 minutes, the Late Arrival Policy is triggered.
   - The system tracks the number of occurrences of late arrivals for each employee within a specified period (e.g., a month).

2. **Action Implementation:**
   - If an employee exceeds the late arrival threshold (e.g., 3 occurrences within a month), the specified action is taken.
   - In this case, the employee's salary is deducted for one day's pay for each late arrival beyond the threshold.

3. **Feedback and Monitoring:**
   - Supervisors or managers receive notifications or reports highlighting employees who have violated the Late Arrival Policy.
   - They can review the attendance records and take appropriate actions, such as providing counseling or issuing warnings to employees with chronic late arrivals.

4. **Policy Evaluation and Adjustment:**
   - HR or management periodically reviews the effectiveness of the Late Arrival Policy.
   - Based on feedback and performance metrics, adjustments may be made to the late arrival threshold, penalty severity, or enforcement procedures to better align with organizational goals and employee needs.

In this example, the attendance policy for late arrivals is defined with specific rules and actions to ensure punctuality and accountability among employees. By implementing and enforcing such policies, organizations can maintain productivity, discipline, and a positive work culture. 
*/