import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Alert } from '@mui/material';
import LegacyCard from '../subcomponents/LegacyCard';
import FormLayout from '../components/FormLayout';
import Page from '../components/Page';
import Layout from '../components/Layout';

export default function ActivateAccount() {
    const [otp, setOTP] = useState("");
    const [activatedResponse, setActivatedResponse] = useState(null);
    const [resendResponse, setResendResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const { activateAccount, updateProfile, resendMyOTP } = useAuth();

    useEffect(() => {
        document.title = "Activate your account";
    }, []);

    const handleClick = async () => {
        setLoading(true);
        setActivatedResponse(null);
        setResendResponse(null);
        var response = await activateAccount(otp);
        if (response) {
            setActivatedResponse(response);
            if (response.status === "success") {
                updateProfile();
            }
        }
        setLoading(false);
    }

    const handleResendOTP = async () => {
        setResendLoading(true);
        setResendResponse(null);
        setActivatedResponse(null);
        var response = await resendMyOTP();
        setResendResponse(response);
        setResendLoading(false);
    }

    return (
        <Page>
            <Layout>
                <Layout.Section oneThird></Layout.Section>
                <Layout.Section oneThird>
                    <LegacyCard sectioned>
                        <FormLayout alignItems="center">
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <CheckCircleIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Activate your account
                            </Typography>
                            <Typography component="p" variant="p" color="text.secondary">
                                An OTP has been sent to the email address you provided. Please enter the OTP to begin.
                            </Typography>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Enter OTP"
                                prefix="A-"
                                value={otp}
                                onChange={(e) => {
                                    setOTP(e.target.value);
                                    if (e.target.value.length >= 6) {
                                        handleClick();
                                    }
                                }}
                                disabled={loading}
                            />
                            <Button
                                fullWidth
                                disabled={otp.length !== 8?true:loading}
                                onClick={handleClick}
                                variant="contained"
                            >
                                Activate
                            </Button>
                            <Button
                                onClick={handleResendOTP} 
                                variant="text"
                                disabled={resendLoading}
                            >
                                Resend OTP
                            </Button>
                            {
                                activatedResponse && (
                                    <div>
                                        <Alert severity={activatedResponse.status === "success"?"success":"error"} title={activatedResponse.message}>
                                            {activatedResponse.message}
                                        </Alert>
                                    </div>
                                )
                            }
                            {
                                resendResponse && (
                                    <div>
                                        <Alert severity={resendResponse.status === "success"?"success":"error"} title={resendResponse.message}>
                                            {resendResponse.message}
                                        </Alert>
                                    </div>
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