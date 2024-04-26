import { Stack, Typography } from "@mui/material";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import LegacyPage from "../subcomponents/LegacyPage";
import Attendance from "../widgets/Attendance";
import WorkingTimeGraph from "../widgets/WorkingTimeGraph";
import Profile from "../widgets/Profile";

export default function Home(){
    const { user } = useAuth();

    useEffect(() => {
        document.title = "Home";
    }, []);

    return(
        <LegacyPage>
            <Layout>
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