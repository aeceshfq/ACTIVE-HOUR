import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import route_names from '../routes/route_names';
import { useRequest } from '../providers/AppProvider';
import server_route_names from '../routes/server_route_names';
import { Alert, Paper } from '@mui/material';

export default function ForgotPassword() {
    const navigate = useNavigate();

    const { data: response, error: responseError, sendRequest } = useRequest();

    const [email, setEmail] = useState("");
    
    useEffect(() => {
        document.title = "Reset password";
    }, []);

    const handleClick = async () => {
        let data = {
            email
        };
        let response = await sendRequest({
            url: `${server_route_names["account.password.forgot"]}`,
            type: "post",
            data: data
        });
        if (response?.status === "success") {
            setEmail("");
        }
    }

    return (
        <Container component={Paper} maxWidth="xs" sx={{py: 2, mt: 8}}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Forgot Password
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 2 }}
                        onClick={handleClick}
                        disabled={!email}
                    >
                        Reset password
                    </Button>
                    {
                        (responseError) && (
                            <Alert severity="error">{responseError}</Alert>
                        )
                    }
                    {
                        (response) && (
                            <Alert severity={response.status === "success"?"success":"error"} title={response.message}>{response.message}</Alert>
                        )
                    }
                    <Button
                        onClick={() => {
                            navigate(route_names.login);
                        }}
                        variant="text"
                        sx={{ mt: 1 }}
                    >
                        Sign in
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}