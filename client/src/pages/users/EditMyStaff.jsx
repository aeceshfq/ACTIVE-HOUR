import { useEffect, useState } from "react";
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFetch, useRequest } from "../../providers/AppProvider";
import LegacyCard from "../../subcomponents/LegacyCard";
import server_route_names from "../../routes/server_route_names";
import PermissionSelections from "../../components/PermissionSelections";
import Page from "../../components/Page";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import route_names from "../../routes/route_names";
import SkeletonPage from "../../components/SkeletonPage";
import _enum from "../../namespace/enum";
import { useAuth } from "../../providers/AuthProvider";

export default function EditMyStaff () {
    const { id } = useParams();
    
    const { user: MyAccount } = useAuth();
    const { data: userAccount, fetching: userLoading, error: userError } = useFetch(`${server_route_names.users}?id=${id}&type=privileges`);
    
    const { data: requestSent, loading: sendingRequest, error: requestError, sendRequest } = useRequest();

    const [permissions, setPermissions] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [designation,setDesignation] = useState("");
    
    const navigate = useNavigate();

    useEffect(() => {
        if (userAccount && userAccount?.email) {
            setFirstName(userAccount.firstName);
            setLastName(userAccount.lastName);
            setEmail(userAccount.email);
            setPermissions(userAccount.privileges.map(x => x.scope));
            setRole(userAccount.role);
            setDesignation(userAccount.designation);
            setStatus(userAccount.status);
        }
    }, [userAccount])

    const updateStaff = async () => {
        // /staff/add
        let data = {
            firstName: firstName,
            lastName: lastName,
            email: userAccount?.email,
            permissions: permissions,
            userId: userAccount._id
        };
        if (role) data["role"] = role;
        if (designation) data["designation"] = designation;
        if (status) data["status"] = status;

        await sendRequest({
            url: server_route_names["users.update"],
            type: "put",
            data: data
        });
    }

    const validate = () => {
        if(!firstName || firstName.trim() === "") return false;
        if(!lastName || lastName.trim() === "") return false;
        if(!email || email.trim() === "") return false;
        return true;
    }

    if(userLoading){
        return (
            <SkeletonPage />
        )
    }

    if (userError) {
        return (
            <Page
                title="Error"
                backAction={() => {
                    navigate(route_names["management.staff"])
                }}
            >
                {userError}
            </Page>
        )
    }

    return (
        <Page
            title={userAccount?.fullName??"Staff member"}
            backAction={() => {
                navigate(route_names["management.staff"])
            }}
        >
            <Layout>
                <Layout.Annotated
                    title="Staff member"
                    content="Give staff access to your software by sending them an invitation."
                >
                <LegacyCard title="Staff member">
                    <LegacyCard.Section stacked>
                        <TextField
                            required
                            fullWidth={false}
                            label="First name"
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                            }}
                        />
                        <TextField
                            required
                            sx={{ml: 2}}
                            fullWidth={false}
                            label="Last name"
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                            }}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Email address"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            disabled
                        />
                        <FormControl size="small">
                            <InputLabel id="userAccount-status-selection">Account status</InputLabel>
                            <Select
                                labelId="userAccount-status-selection"
                                id="userAccount-status-select"
                                value={status}
                                label="Account status"
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                }}
                                disabled={userAccount._id === MyAccount._id}
                            >
                                {
                                    _enum.user.status.map(x => (
                                        <MenuItem key={x} value={x}>{String(x).replace(/\_/g, ' ')}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        
                        <FormControl size="small">
                            <InputLabel id="userAccount-role-selection">Role</InputLabel>
                            <Select
                                labelId="userAccount-role-selection"
                                id="userAccount-role-select"
                                value={role}
                                label="Role"
                                onChange={(e) => {
                                    setRole(e.target.value)
                                }}
                                disabled={userAccount._id === MyAccount._id}
                            >
                                {
                                    _enum.user.role.map(x => (
                                        <MenuItem key={x} value={x}>
                                            {String(x).replace(/\_/g, ' ')}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl size="small">
                            <InputLabel id="userAccount-desig-selection">Designation</InputLabel>
                            <Select
                                labelId="userAccount-desig-selection"
                                id="userAccount-role-select"
                                value={designation}
                                label="Designation"
                                onChange={(e) => {
                                    setDesignation(e.target.value)
                                }}
                            >
                                {
                                    _enum.employeeDesignations.map(x => (
                                        <MenuItem key={x} value={x}>
                                            {String(x).replace(/\_/g, ' ')}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </LegacyCard.Section>
                    <LegacyCard.Section title="Permissions">
                        <PermissionSelections
                            onSelection={(selection) => {
                                setPermissions(selection);
                            }}
                            selected={permissions}
                            readOnly={userAccount._id === MyAccount._id}
                        />
                    </LegacyCard.Section>
                    <LegacyCard.Section>
                        <Button
                            onClick={updateStaff}
                            disabled={sendingRequest?true:!validate()}
                            variant="contained"
                        >
                            Update user
                        </Button>
                        {
                            requestError && (
                                <Alert sx={{mt: 2}} severity="error">
                                    {requestError}
                                </Alert>
                            )
                        }
                        {
                            requestSent && (
                                <Alert sx={{mt: 2}} severity="success">
                                    {requestSent.message}
                                </Alert>
                            )
                        }
                    </LegacyCard.Section>
                </LegacyCard>
                </Layout.Annotated>
            </Layout>
        </Page>
    )
}