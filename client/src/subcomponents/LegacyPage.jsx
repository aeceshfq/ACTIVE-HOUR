import { Button, Typography, Grid, Stack, IconButton, Box, useMediaQuery, Container } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function LegacyPage ({ 
    title = null,
    actions = [],
    children,
    backAction = null,
    fullWidth = false,
    headerSlots = null,
    slots = null,
 }) {

    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const paddingLR = fullWidth?2:lgUp?6:smDown?1:3;
    const titleColumns = actions?5:12;
    let slotsMT = 0;

    if(title || actions?.length > 0 || headerSlots){
        slotsMT = 1
    }

    return (
        <Container maxWidth="xl">
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
                        <Grid container sx={{mb: slots?0:2}} alignItems="end" justifyContent="start">
                            <Grid item sm={titleColumns} md={titleColumns} lg={titleColumns} xl={titleColumns} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {
                                        (typeof backAction==="function"||typeof backAction?.onCLick==="function") && (
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
                                ((headerSlots) && (!actions || actions?.length === 0)) && 
                                <Grid item sm={7} md={7} lg={7} xl={7} xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "end"
                                    }}
                                >
                                    {headerSlots}
                                </Grid>
                            }
                            {
                                (actions && actions?.length > 0) && (
                                    <Grid item sm={7} md={7} lg={7} xl={7} xs={12}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "end"
                                        }}
                                    >
                                        <Stack direction="row" spacing={2}>
                                            {headerSlots}
                                            {
                                                actions.map(button => (
                                                    <Button onClick={button.onClick} disabled={button.disabled} size="small" key={button.title} type="button" color={button.color??"primary"} variant={button.variant??"text"}>{button.title}</Button>
                                                ))
                                            }
                                        </Stack>
                                    </Grid>
                                )
                            }
                        </Grid>
                    )
                }
                {
                    slots && (
                        <Grid container sx={{mb: 2, mt: slotsMT }}>
                            <Grid item sm={12} md={12} lg={12} xl={12} xs={12}>
                                {slots}
                            </Grid>
                        </Grid>
                    )
                }
                <Grid container>
                    <Grid item sm={12} md={12} lg={12} xl={12} xs={12}>
                        {children}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
    
}