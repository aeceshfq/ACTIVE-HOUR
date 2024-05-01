import { createContext, useContext, useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import route_names from "../routes/route_names";
import AuthRoutes from "../auth/AuthRoutes";
import AppDataProvider from "./AppDataProvider";
import AppLayout from "../layouts/dashboard/AppLayout";
import AppRouter from "../routes/AppRouter";
import { Backdrop, CircularProgress } from "@mui/material";
import server_route_names from "../routes/server_route_names";
import ActivateAccount from "../auth/ActivateAccount";
import { httpRequest } from "../functions/httpRequest";

const AuthContext = createContext();
const AuthorizedContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const usePrivileges = () => useContext(AuthorizedContext);

const AuthProvider = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerified, setIsVerified] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const match = useMatch("/auth/*");

    useEffect(() => {
        if (!match) {
            refresh();
        }
        else{
            setIsLoading(false);
        }
    }, []);

    const unAuthenticated = () => {
        setUser(null);
        setIsAuthenticated(null);
        setIsLoading(false);
        if (!match) {
            navigate(route_names.login);
        }
    };

    const updateProfile = async () => {
        await refreshUserData();
        return user;
    };

    const refreshUserData = async () => {
        var response = await httpRequest.get(server_route_names["account.verify"]);
        if (response && response.status === "success") {
            if (response.isAuthenticated) {
                setIsAuthenticated(true);
                setIsVerified(response.isVerified);
                setUser(response.user);
            }
            else {
                unAuthenticated();
            }
        }
        else{
            unAuthenticated();
        }
    };

    const refresh = async () => {
        verifyUserSession();
    };

    const verifyUserSession = async () => {
        setIsLoading(true);
        var response = await httpRequest.get(server_route_names["account.verify"]);
        if (response && response.status === "success") {
            if (response.isAuthenticated) {
                setIsAuthenticated(true);
                setIsVerified(response.isVerified);
                setUser(response.user);
                setIsLoading(false);
            }
            else {
                unAuthenticated();
            }
        }
        else{
            unAuthenticated();
        }
    };

    const changePassword = async (oldPassword, password, confirmPassword) => {
        // Make a call to the authentication
        let data = {
            userId: user.userId,
            oldPassword,
            password,
            confirmPassword,
        };
        var response = await httpRequest.post(server_route_names["account.password.update"], data);
        return response;
    };

    const login = async (email, password) => {
        // Make a call to the authentication
        var response = await httpRequest.post(server_route_names["account.login"], { email, password, });
        if (response?.status === "success") {
            setUser(response?.user);
            setIsAuthenticated(true);
            if (response?.user?.status === "ACTIVE") {
                setIsVerified(true);
            }
        }
        return response;
    };

    // but, logout not working
    const logout = async () => {
        // Make a call to the authentication
        var response = await httpRequest.post(server_route_names["account.logout"]);
        unAuthenticated();
    };

    const register = async (data) => {
        // Make a call to the authentication
        var response = await httpRequest.post(server_route_names["account.register"], data);
        if (response?.status === "success") {
            setUser(response?.user);
            setIsAuthenticated(true);
        }
        return response;
    };

    const activateAccount = async (otp) => {
        // Make a call to the authentication
        var response = await httpRequest.post(server_route_names["account.activate"], { id: user.userId, otp: otp });
        if (response?.status === "success") {
            await updateProfile();
        }
        return response;
    };

     const resendMyOTP = async () => {
        // Make a call to the authentication
        var response = await httpRequest.post(server_route_names["account.otp.resend"], {email: user.email});
        return response;
    };

    const hasPermission = (permissions) => {
        if (user.role === "SUPER_ADMIN") {
            return true;
        }
        else if (user?.privileges) {
            if (typeof permissions === "string") {
                var index = user?.privileges.findIndex( x => x.scope === permissions && x.status === "GRANTED" );
                if (index > -1) {
                    return true;
                }
                else{
                    return false;
                }
            }
            else if(typeof permissions === "object"){
                let has = false;
                try {
                    for (let pIndex = 0; pIndex < permissions.length; pIndex++) {
                        const perm = permissions[pIndex];
                        var iindex = user?.privileges.findIndex( x => x.scope === perm && x.status === "GRANTED" );
                        if (iindex > -1) {
                            has = true;
                            break;
                        }
                    }
                } catch (error) {
                    
                }
                return has;
            }
            else if (typeof permissions === "boolean") {
                if (permissions === true) {
                    return true;
                }
                else{
                    return false;
                }
            }
        }
        return false;
    }

    if (loading) {
        return (
            <Backdrop open>
                <CircularProgress></CircularProgress>
            </Backdrop>
        );
    }

    if (!user) {
        return (
            <AuthContext.Provider
                value={{
                    user,
                    isAuthenticated: false,
                    loading,
                    isVerified,
                    login,
                    register,
                    refresh,
                    resendMyOTP
                }}
            >
                <AuthRoutes />
            </AuthContext.Provider>
        );
    }

    if (!isVerified) {
        return (
            <AuthContext.Provider
                value={{
                    user,
                    isAuthenticated,
                    isVerified,
                    login,
                    register,
                    refresh,
                    activateAccount,
                    updateProfile,
                    resendMyOTP
                }}
            >
                <ActivateAccount />
            </AuthContext.Provider>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isVerified,
                loading,
                login,
                register,
                logout,
                refresh,
                changePassword,
                updateProfile
            }}
        >
            <AuthorizedContext.Provider value={{ user, hasPermission }}>
                <AppDataProvider>
                    <AppLayout>
                        <AppRouter />
                    </AppLayout>
                </AppDataProvider>
            </AuthorizedContext.Provider>
        </AuthContext.Provider>
    );
};

export default AuthProvider;
