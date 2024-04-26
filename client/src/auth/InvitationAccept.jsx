import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LegacyCard from '../subcomponents/LegacyCard';
import FormLayout from '../components/FormLayout';
import Page from '../components/Page';
import Layout from '../components/Layout';
import { useFetch, useRequest } from '../providers/AppProvider';
import server_route_names from '../routes/server_route_names';
import { Alert, Skeleton } from '@mui/material';
import route_names from '../routes/route_names';

export default function InvitationAccept() {
    
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const navigate = useNavigate();

    const { data: createAccount, loading: creatingAccount, error: accountError, sendRequest } = useRequest();

    const { data: user, fetching, error } = useFetch(`${server_route_names["account.verify.token"]}`, {type: "post", data: { token:token }});

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [userAccount, setUserAccount] = useState(null);

    useEffect(() => {
        if (user) {
            setLoading(false);
            setUserAccount(user);
        }
        else if(error){
            
        }
    }, [user, error]);
    
    useEffect(() => {
        if (createAccount) {
            setPassword("");
            setConfirmPassword("");
            navigate(`${route_names.login}?m=${createAccount.message}`);
        }
    }, [createAccount]);
    

    useEffect(() => {
        document.title = "Inviation";
    }, []);

    useEffect(() => {
        if (!token) {
            navigate(`${route_names.login}?m=invalid token`);
        }
    }, [token]);

    if (loading) {
        return (
            <Page>
                <Layout>
                    <Layout.Section oneThird></Layout.Section>
                    <Layout.Section oneThird>
                        <LegacyCard sectioned maxWidth="sm">
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                        </LegacyCard>
                    </Layout.Section>
                    <Layout.Section oneThird></Layout.Section>
                </Layout>
            </Page>
        )
    }

    if (error) {
        return (
            <div>
                {error}
            </div>
        )
    }

    const validate = () => {
        if (!password) return false;
        if (!confirmPassword) return false;
        if (password !== confirmPassword) return false;
        return true;
    }

    const handleClick = async () => {
        let data = {
            password, confirmPassword, token
        };
        let response = await sendRequest({
            url: `${server_route_names['account.invitation.accept']}`,
            type: "post",
            data: data
        });
    }

    return (
        <Page>
            <Layout>
                <Layout.Section oneThird></Layout.Section>
                <Layout.Section oneThird>
                    <LegacyCard sectioned maxWidth="sm">
                        <FormLayout alignItems="center">
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <AccountCircleIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                {user.firstName} create your password
                            </Typography>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type='password'
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Confirm password"
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                }}
                            />
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={creatingAccount??!validate()}
                                onClick={handleClick}
                            >
                                Create an account
                            </Button>
                            {
                                (createAccount) && (
                                    <Alert severity={createAccount.status === "success"?"success":"error"} title={createAccount.message}>{createAccount.message}</Alert>
                                )
                            }
                        </FormLayout>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section oneThird></Layout.Section>
            </Layout>
        </Page>
    );
}