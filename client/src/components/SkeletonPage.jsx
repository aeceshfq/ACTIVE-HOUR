import { Card, Skeleton } from "@mui/material";
import LegacyPage from "../subcomponents/LegacyPage";

export default function SkeletonPage(){

    return (
        <LegacyPage>
            <Card sx={{width: "100%", p: 2, mb: 2}}>
                <Skeleton variant="text"></Skeleton>
            </Card>
            <Card sx={{width: "100%", p: 2}}>
                <Skeleton variant="text"></Skeleton>
                <Skeleton variant="text"></Skeleton>
                <Skeleton variant="text"></Skeleton>
            </Card>
        </LegacyPage>
    )
}