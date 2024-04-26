import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
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
import { Alert, Card, Paper, Stack } from '@mui/material';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslate();

  const handleSubmit = async (event) => {
    event.preventDefault();
	setIsError(false);
	setIsSuccess(false);
    const data = new FormData(event.currentTarget);
    setLoading(true);
    const response = await register({
		email: data.get('email'),
		password: data.get('password'),
		confirmPassword: data.get('confirmPassword'),
		firstName: data.get('fname'),
		lastName: data.get('lname')
	});
    
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
		return true;
	}

	useEffect(() => {
		document.title = t("register.title");
	}, []);

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
					{t("register.title")}
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="fnane"
						label={t("forms.fname")}
						name="fname"
						type="text"
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						id="lnane"
						label={t("forms.lname")}
						name="lname"
						type="text"
					
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label={t("forms.email")}
						name="email"
						type="email"
						
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label={t("forms.password")}
						type="password"
						id="password"
						
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="confirmPassword"
						label={t("forms.confirmPassword")}
						type="password"
						id="confirmPassword"
						
					/>
					<Button
						type="submit"
						fullWidth
						size="medium"
						sx={{ mt: 1, mb: 3 }}
						disabled={loading}
						variant="contained"
					>
						{t("register.buttonLabel")}
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
						<Button
							size="small"
							onClick={() => {
								navigate(route_names['login']);
							}} variant="text"
						>
						{t("login.buttonLabel")}
						</Button>
					</Stack>
					
				</Box>
			</Box>
		</Container>
	);
}