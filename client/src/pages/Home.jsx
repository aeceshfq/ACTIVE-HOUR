import { Stack, Typography } from "@mui/material";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import LegacyPage from "../subcomponents/LegacyPage";
import Attendance from "../widgets/Attendance";

export default function Home(){
    const { user } = useAuth();

    useEffect(() => {
        document.title = "Home";
    }, []);

    return(
        <LegacyPage>
            <Layout>
                <Layout.Section oneForth>
                    <Attendance />
                </Layout.Section>
            </Layout>
        </LegacyPage>
    )
}