import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { useRequest } from "../../providers/AppProvider";
import LegacyCard from "../../subcomponents/LegacyCard";
import server_route_names from "../../routes/server_route_names";
import PermissionSelections from "../../components/PermissionSelections";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import route_names from "../../routes/route_names";
import LegacyPage from "../../subcomponents/LegacyPage";

export default function AddMyStaff () {
    
    const { data: inviteSent, loading: sendingInvite, error: inviteError, sendRequest } = useRequest();

    const [permissions, setPermissions] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    
    const addStaff = async () => {
        // /staff/add
        var response = await sendRequest({
            url: server_route_names["user.invite"],
            type: "post",
            data: {
                firstName,
                lastName,
                email,
                permissions
            }
        });
        if (response?.status === "success") {
            setFirstName("");
            setLastName("");
            setEmail("");
        }
    }

    const validate = () => {
        if(!firstName || firstName.trim() === "") return false;
        if(!lastName || lastName.trim() === "") return false;
        if(!email || email.trim() === "") return false;
        return true;
    }

    return (
        <LegacyPage
            title="Invite member"
            backAction={() => {
                navigate(route_names["management.staff"])
            }}
        >
            <Layout>
                <Layout.Annotated
                    title="Invite member"
                    content="Staff members can only see or manage sensitive business information such as financial data if you give them access."
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
                        />
                    </LegacyCard.Section>
                    <LegacyCard.Section title="Permissions">
                        <PermissionSelections
                            onSelection={(selection) => {
                                setPermissions(selection);
                            }}
                            selected={permissions}
                        />
                    </LegacyCard.Section>
                    <LegacyCard.Section>
                        <Button
                            onClick={addStaff}
                            disabled={sendingInvite?true:!validate()}
                            variant="contained"
                        >
                            Send invite
                        </Button>
                        {
                            inviteError && (
                                <div>
                                    <Alert severity="error">
                                        {inviteError}
                                    </Alert>
                                </div>
                            )
                        }
                        {
                            inviteSent && (
                                <div>
                                    <Alert severity="success">
                                        {inviteSent.message}
                                    </Alert>
                                </div>
                            )
                        }
                    </LegacyCard.Section>
                </LegacyCard>
                </Layout.Annotated>
            </Layout>
        </LegacyPage>
    )
}