import { Button, Skeleton, Stack, TextField } from "@mui/material";
import LegacyCard from "../subcomponents/LegacyCard";
import { useAuth, usePrivileges } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useFetch, useRequest } from "../providers/AppProvider";
import server_route_names from "../routes/server_route_names";
import { useEffect, useState } from "react";

export default function Organization(){
    const { data: organization, loading, reFetch } = useFetch(`${server_route_names.organization}`);
    const { data: updateOrganization, loading: loadingOrganization, sendRequest } = useRequest();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { hasPermission } = usePrivileges();
    const [name, setName] = useState("");

    useEffect(() => {
        if (organization && organization?.name) {
            setName(organization?.name);
        }
    }, [organization]);

    const update = async() => {
        let url = server_route_names.organization;
        if (organization?._id) {
            url += `?id=${organization?._id}`;
        }
        await sendRequest({
            url: url,
            type: organization?._id?"put":"post",
            data: {
                data: {name}
            }
        });
        if (!organization?._id) {
            reFetch();
        }
    }

    if (loading) {
        return (
            <LegacyCard title="Attendance" sectioned>
                <Skeleton variant="text"></Skeleton>
                <Skeleton variant="text"></Skeleton>
                <Skeleton variant="text"></Skeleton>
            </LegacyCard>
        )
    }

    return(
        <>
            <LegacyCard title="Organization">
                <LegacyCard.Section>
                    <Stack direction="column" spacing={2}>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                        <Button
                            // disabled={!name || String(name).trim() === ""}
                            onClick={update}
                        >Update</Button>
                    </Stack>
                </LegacyCard.Section>
            </LegacyCard>
        </>
    )
}