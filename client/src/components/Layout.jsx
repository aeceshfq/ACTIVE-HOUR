import { Grid, Paper, Stack, Typography } from "@mui/material";

const Layout = ({ sx, children, alignItems="baseline", spacing=2, paper, maxWidth="xl" }) => {
    let sxObject = {
        // mb: 2
    };
    if (sx) {
        sxObject = {...sxObject, ...sx};
    }

    if (paper) {
        return(
            <Paper sx={{ my: 2, p: 2 }} variant="outlined">
                <Grid
                    container
                    sx={sxObject}
                    alignItems={alignItems}
                    spacing={spacing}
                >
                    {children}
                </Grid>
            </Paper>
        )
    }

    return(
        <Grid
            container
            sx={sxObject}
            alignItems={alignItems}
            spacing={spacing}
        >
            {children}
        </Grid>
    )
    
}

Layout.Annotated = ({
    children, title = null, content = null
}) => {
    return (
        <>
            <Grid
                item xs={12} sm={12} md={4} lg={5} xl={5}
            >
                <Stack direction="column" spacing={2}>
                    <Typography variant="h5">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">{content}</Typography>
                </Stack>
            </Grid>
            <Grid
                item xs={12} sm={12} md={8} lg={7} xl={7}
            >
                {children}
            </Grid>
        </>
    )
}

Layout.Item = ({
    children, oneHalf = false, oneThird = false, twoThird = false
}) => {
    let columns = oneHalf?6:oneThird?4:twoThird?8:12;
    return (
        <Grid item xs={12} sm={12} md={12} lg={columns} xl={columns}>{children}</Grid>
    )
}

Layout.Section = ({
    children, oneHalf = false, oneThird = false, twoThird = false, oneForth = false, height = null
}) => {
    let columns = oneForth?3:oneThird?4:oneHalf?6:twoThird?8:12;
    return (
        <Grid item xs={12} sm={12} md={12} lg={columns} xl={columns} alignItems="center" height={height}>{children}</Grid>
    )
}

export default Layout;