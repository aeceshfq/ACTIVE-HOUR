import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function LegacyModal({ 
    open = false,
    title = "",
    children = null,
    primaryAction = null,
    secondaryAction = null,
    onClose = () => {},
    onCancel = null,
    TransitionProps = {
        onEntered: () => {},
        onAbort: () => {}, 
    },
    hideCloseIcon = false,
    size = "sm",
    hideFooter = false,
 }) {
  return (
    <Dialog
        TransitionProps={TransitionProps}
        open={open}
        onClose={onClose}
        aria-labelledby="legacydialog-title"
        aria-describedby="legacydialog-description"
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth={size??"sm"}
    >
    <DialogTitle id="legacydialog-title">
        <Stack sx={{width: "100%"}} justifyItems="center" direction="row">
            <Stack sx={{width: "100%"}} >
                {title}
            </Stack>
            {
                !hideCloseIcon &&
                <Stack alignItems="end">
                    <IconButton
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            }
        </Stack>
    </DialogTitle>
    <DialogContent dividers>
        {children}
    </DialogContent>
    {
        !hideFooter && <DialogActions>
            {
                !secondaryAction && typeof onCancel === "function" && (
                    <Button
                        onClick={onCancel}
                        variant="text"
                    >
                        Cancel
                    </Button>
                )
            }
            {
                secondaryAction && (
                    <Button
                        onClick={secondaryAction.onClick}
                        variant={secondaryAction.variant??"text"}
                        disabled={secondaryAction.disabled}
                        color={secondaryAction.color}
                    >
                        {secondaryAction.title}
                    </Button>
                )
            }
            {
                primaryAction && (
                    <Button
                        onClick={primaryAction.onClick}
                        variant={primaryAction.variant??"text"}
                        disabled={primaryAction.disabled}
                        color={primaryAction.color}
                    >
                        {primaryAction.title}
                    </Button>
                )
            }
        </DialogActions>
    }
    </Dialog>
  );
}