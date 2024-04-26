import { Stack, useTheme } from "@mui/material";

export default function Logo ({direction = "row", children}) {
    const theme = useTheme();
    return (
        <Stack direction={direction} flexWrap="nowrap" alignItems="center" height={(theme) => `${theme.mixins.toolbar.height}`}>
            {children}
            <img src={`/nexatech-logo-${(theme.palette.mode === "dark"?"white-":"")}48x.png`} width="42px" alt="NexaTech Logo"></img>
        </Stack>
    )
}