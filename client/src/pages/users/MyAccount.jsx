import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { Alert, Button, TextField } from "@mui/material";
import Layout from "../../components/Layout";
import { useFetch, useUpdateRecord } from "../../providers/AppProvider";
import server_route_names from "../../routes/server_route_names";
import SkeletonPage from "../../components/SkeletonPage";
import LegacyCard from "../../subcomponents/LegacyCard";
import LegacyPage from "../../subcomponents/LegacyPage";

const MyAccount = () => {

    const { data: recordUpdated, updateRecord, loading: updatingRecord, error: updateError } = useUpdateRecord(server_route_names.myaccount);
    const { data: userData, fetching: loadingUser } = useFetch(server_route_names.myaccount);

    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [passwordUpdatedResponse, setPasswordUpdatedResponse] = useState(null);

    const [user, setUser] = useState(null);

    const { changePassword, updateProfile } = useAuth();

    useEffect(() => {
        document.title = "My Account";
    }, []);

    const updatePassword = async () => {
        setUpdatingPassword(true);
        setPasswordUpdatedResponse(null);
        var response = await changePassword(oldPassword, password, confirmPassword);
        setPasswordUpdatedResponse(response);
        if (response?.status === "success") {
        setPassword("");
        setOldPassword("");
        setConfirmPassword("");
       }
       setUpdatingPassword(false);
    }

    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, [userData]);

    if (loadingUser || !user) {
        return (
            <SkeletonPage/>
        )
    }

    return (
        <LegacyPage>
            <Layout>
                <Layout.Annotated
                    title="My profile"
                    content="Manage your personal information"
                >
                    <LegacyCard title="My profile">
                        <LegacyCard.Section stacked spacing={3}> 
                            <TextField
                                fullWidth
                                label="First name"
                                value={user.firstName}
                                onChange={(e) => {
                                    let u = JSON.parse(JSON.stringify(user));
                                    u.firstName = e.target.value;
                                    setUser(u);
                                }}
                                error={!user.firstName}
                            ></TextField>
                            <TextField
                                fullWidth
                                label="Last name"
                                value={user.lastName}
                                onChange={(e) => {
                                    let u = JSON.parse(JSON.stringify(user));
                                    u.lastName = e.target.value;
                                    setUser(u);
                                }}
                                error={!user.lastName}
                            ></TextField>
                            <TextField
                                fullWidth
                                label="Email address"
                                value={user.email}
                                disabled
                            ></TextField>
                            <TextField
                                fullWidth
                                type="number"
                                label="Phone"
                                value={user.phone}
                                onChange={(e) => {
                                    let u = JSON.parse(JSON.stringify(user));
                                    u.phone = e.target.value;
                                    setUser(u);
                                }}
                                error={!user.phone}
                            ></TextField>
                            <div>
                                <Button
                                    onClick={ async () => {
                                        var response = await updateRecord(user._id, {
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            phone: user.phone,
                                        });

                                        if (response && response.status === "success") {
                                            updateProfile(user);
                                        }
                                        
                                    }}
                                    variant="contained"
                                    disabled={
                                        (!user.firstName || !user.lastName || !user.phone)?true:
                                        updatingRecord
                                    }
                                >
                                    Update profile
                                </Button>
                            </div>
                            {
                                (!updateError && recordUpdated && recordUpdated.status === "success") && (
                                    <Alert severity="success"> {recordUpdated.message} </Alert>
                                )
                            }
                            {
                                (updateError) && (
                                    <Alert severity="error"> {updateError} </Alert>
                                )
                            }
                        </LegacyCard.Section>
                    </LegacyCard>
                </Layout.Annotated>
                <Layout.Annotated
                    title="Security"
                    content="Manage your passwords and logins"
                >
                    <LegacyCard title="Password">
                        <LegacyCard.Section stacked spacing={3}>
                            <TextField
                                fullWidth
                                label="Old password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => {
                                    setOldPassword(e.target.value);
                                }}
                            ></TextField>
                            <TextField
                                fullWidth
                                label="New password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            ></TextField>
                            <TextField
                                fullWidth
                                label="Retype new password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                }}
                            ></TextField>
                            <div>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        updatePassword();
                                    }}
                                    disabled={
                                        (!password||!confirmPassword||!oldPassword)?true:updatingPassword
                                    }
                                >
                                    Update password
                                </Button>
                            </div>
                            {
                                (passwordUpdatedResponse && passwordUpdatedResponse.status === "success") && (
                                    <Alert severity="success"> Password has been updated </Alert>
                                )
                            }
                            {
                                (passwordUpdatedResponse && passwordUpdatedResponse.status === "failed") && (
                                    <Alert severity="error"> {passwordUpdatedResponse.message} </Alert>
                                )
                            }
                        </LegacyCard.Section>
                    </LegacyCard>
                </Layout.Annotated>
            </Layout>
        </LegacyPage>
    )
}

export default MyAccount;