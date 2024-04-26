const server_route_names = {
    "users": "/user/users",
    "users.update": "/user/users/update",
    "user.invite": "/user/staff/add",
    "myaccount": "/user/myaccount",
    "account.login": "/auth/login",
    "account.logout": "/auth/logout",
    "account.register": "/auth/register",
    "account.activate": "/auth/account/activate",
    "account.otp.resend": "/auth/account/otp/resend",
    "account.password.create": "/auth/account/password/create",
    "account.password.forgot": "/auth/account/password/forgot",
    "account.password.update": "/auth/account/password/update",
    "account.verify": "/auth/account/verify_user",
    "account.verify.token": "/auth/account/verify_token",
    "account.invitation.accept": "/auth/account/accept_invitation",
    "attendance": "/api/attendance",
    "attendance.signin": "/api/attendance/signin",
    "attendance.signout": "/api/attendance/signout",
    "attendance.status": "/api/attendance/status",
};

export default server_route_names;