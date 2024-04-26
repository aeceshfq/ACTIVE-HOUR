import { Button, Icon, Stack, Typography } from "@mui/material";
import LegacyCard from "../subcomponents/LegacyCard";
import { useAuth } from "../providers/AuthProvider";
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import route_names from "../routes/route_names";

export default function Profile(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return(
        <>
            <LegacyCard title="Profile">
                <LegacyCard.Section>
                    <Stack alignItems="center" direction="column" spacing={1}>
                        <AccountCircleIcon fontSize="large" sx={{width: 84, height: 84}} color="primary" />
                        <Typography variant="h6" color="primary">
                            {user.fullName}
                        </Typography>
                        <Typography variant="caption">
                            {String(user.role).replace(/\_/g, ' ')}
                        </Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                navigate(route_names.myaccount);
                            }}
                        >
                            My Profile
                        </Button>
                    </Stack>
                </LegacyCard.Section>
            </LegacyCard>
        </>
    )
}