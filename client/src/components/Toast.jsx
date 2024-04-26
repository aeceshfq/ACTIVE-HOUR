import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Toast({
    open,
    message,
    type,
	onClose = () => {}
}) {
 	const [isOpen, setIsOpen] = React.useState(open??false);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setIsOpen(false);

		if (typeof onClose === "function") {
			onClose(false);
		}
	};

	return (
		<Snackbar
			open={isOpen}
			autoHideDuration={5000}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
		>
			<Alert onClose={handleClose} severity={type}>
				{message}
			</Alert>
		</Snackbar>
	)
}