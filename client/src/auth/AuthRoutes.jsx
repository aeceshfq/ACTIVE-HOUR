import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import SetNewPassword from "./SetNewPassword";
import route_names from "../routes/route_names";
import InvitationAccept from "./InvitationAccept";
import Register from "./Register";

const AuthRoutes = () => {

    return (
        <Routes>
            <Route path="/auth">
                <Route index element={<Login />}/>
                <Route path={route_names.login} element={<Login />}/>
                {
                    route_names.hasOwnProperty('register') && <Route path={route_names.register} element={<Register />}/>
                }
                <Route path={route_names["forgot.password"]} element={<ForgotPassword />}/>
                <Route path={route_names["reset.password"]} element={<SetNewPassword />}/>
                <Route path={route_names["auth.invitation"]} element={<InvitationAccept />}/>
            </Route>
            <Route path="*" element={<Login />}/>
        </Routes>
    )
}

export default AuthRoutes;