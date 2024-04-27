import { Stack } from "@mui/material";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import LegacyPage from "../subcomponents/LegacyPage";
import Attendance from "../widgets/Attendance";
import WorkingTimeGraph from "../widgets/WorkingTimeGraph";
import Profile from "../widgets/Profile";
import Organization from "../widgets/Organization";

export default function Home(){
    const { user } = useAuth();
    // const { hasPermission } = usePrivileges();

    useEffect(() => {
        document.title = "Home";
    }, []);

    return(
        <LegacyPage>
            <Layout>
                {
                    user?.role === "OWNER" && 
                    <Layout.Section>
                        <Organization />
                    </Layout.Section>
                }
                <Layout.Section oneThird>
                    <Stack direction="column" spacing={2}>
                        <Profile />
                        <Attendance />
                    </Stack>
                </Layout.Section>
                <Layout.Section twoThird>
                    <WorkingTimeGraph />
                </Layout.Section>
            </Layout>
        </LegacyPage>
    )
}