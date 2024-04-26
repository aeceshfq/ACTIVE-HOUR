import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Toast from '../components/Toast';
import route_names from '../routes/route_names';
import { useAuth } from '../providers/AuthProvider';
import { useTranslate } from '../providers/AppProvider';
import { Alert, Paper, Stack } from '@mui/material';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslate();

  const handleSubmit = async (event) => {
    event.preventDefault();
	setIsError(false);
	setIsSuccess(false);
    const data = new FormData(event.currentTarget);
    setLoading(true);
    const response = await login(data.get('email'), data.get('password'));
    
    setLoading(false);

    if (response?.status === "failed") {
		setIsError(response?.message);
		setIsSuccess(false);
    }
    else if(response?.status === "success"){
		setIsSuccess(true);
		setIsError(false);
		navigate(route_names.home);
    }
  };

	const validated = () => {
		if (!email) return false;
		if (!password) return false;

		return true;
	}

	useEffect(() => {
		document.title = t("login.title");
	}, [t]);

	return (
		<Container component={Paper} maxWidth="xs" sx={{py: 2, mt: 8}}>
			{
				isSuccess && (<Toast open={true} message={"Login success"} type={"success"} onClose={() => {setIsSuccess(false)}}></Toast>)
			}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					{t("login.title")}
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label={t("forms.email")}
						name="email"
						type="email"
						autoComplete="email"
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
						}}
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label={t("forms.password")}
						type="password"
						id="password"
						autoComplete="current-password"
						value={password}
						onChange={(event) => {
							setPassword(event.target.value);
						}}
					/>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label={t("login.rememberMe")}
					/>
					<Button
						type="submit"
						fullWidth
						size="medium"
						sx={{ mt: 1, mb: 3 }}
						disabled={loading || !validated()}
						variant="contained"
					>
						{t("login.buttonLabel")}
					</Button>
					{
						(isError || isSuccess) && (
							<Alert sx={{mb: 2}} severity={isSuccess?"success":isError?"error":"info"}>
								{
									isSuccess?isSuccess:isError
								}
							</Alert>
						)
					}
					<Stack spacing={1} direction="row" alignItems="center">
						{
							route_names.hasOwnProperty('register') && 
							<Button
								size="small"
								onClick={() => {
									navigate(route_names['register']);
								}} variant="text"
							>
							{t("register.buttonLabel")}
							</Button>
						}
						{
							route_names.hasOwnProperty('register') && <div>|</div>
						}
						<Button
							size="small"
							onClick={() => {
								navigate(route_names['forgot.password']);
							}} variant="text"
						>
						{t("login.forgotPasswordLink")}
						</Button>
					</Stack>
					
				</Box>
			</Box>
		</Container>
	);
}