import { Button, Typography, Grid, Stack, IconButton, Box, useMediaQuery } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Page ({ title, primaryAction, actions, children, backAction, fullWidth }) {

    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const paddingLR = fullWidth?2:lgUp?6:smDown?1:3;
    const titleColumns = primaryAction?9:12;
    return (
        <Box
            sx={{
                mt: 2,
                mb: 2,
                pl: paddingLR,
                pr: paddingLR,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {
                title && (
                    <Grid container sx={{mb: 2}} alignItems="center">
                        <Grid item sm={titleColumns} md={titleColumns} lg={titleColumns} xl={titleColumns} xs={12}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {
                                    backAction && (
                                        <IconButton
                                            aria-label="Back"
                                            onClick={typeof backAction==="function"?backAction:backAction.onClick}
                                        >
                                            <ArrowBackIcon />
                                        </IconButton>
                                    )
                                }
                                <Typography variant="h5" fontWeight="bold">{title}</Typography>
                            </Stack>
                        </Grid>
                        {
                            primaryAction && (
                                <Grid item sm={3} md={3} lg={3} xl={3} xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "end"
                                    }}
                                >
                                    <div>
                                        <Button
                                            variant="contained"
                                            onClick={primaryAction.onClick}
                                            disabled={primaryAction.disabled??false}
                                        >
                                            {primaryAction.title}
                                        </Button>
                                    </div>
                                </Grid>
                            )
                        }
                        {
                            (actions && actions?.length > 0) && (
                                <Grid item sm={12} md={12} lg={12} xl={12} xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                        mt: 1, ml: 2 
                                    }}
                                >
                                <Stack direction="row" spacing={2}>
                                    {
                                        actions.map(button => (
                                            <Button onClick={button.onClick} disabled={button.disabled} size="small" key={button.title} type="button" color={button.color??"secondary"}>{button.title}</Button>
                                        ))
                                    }
                                </Stack>
                                </Grid>
                            )
                        }
                    </Grid>
                )
            }
            <Grid container>
                <Grid item sm={12} md={12} lg={12} xl={12} xs={12}>
                    {children}
                </Grid>
            </Grid>
        </Box>
    )
    
}