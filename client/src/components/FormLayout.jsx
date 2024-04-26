import { Stack } from "@mui/material";

const FormLayout = ({children, spacing=2, maxWidth = "sm", alignItems="flex-start"}) => {
    return (
        <Stack sx={{width: "100%"}} spacing={spacing} maxWidth={maxWidth} alignItems={alignItems}>
            {children}
        </Stack>
    )
}

export default FormLayout;