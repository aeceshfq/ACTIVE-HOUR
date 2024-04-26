import { Card, CardContent, CardHeader, Divider, IconButton, Menu, MenuItem, Stack } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";

const LegacyCard = ({
    children = null,
    title = null,
    sectioned = false,
    maxWidth = null,
    actions = [],
    height = null
}) => {
    const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
    const openActions = Boolean(actionsAnchorEl);

    return (
        <Card sx={{maxWidth}}>
            {
                title && (
                    <>
                        <CardHeader
                            sx={{pb: 0, mb: 0}}
                            title={title}
                            titleTypographyProps={{
                                variant: 'h6'
                            }}
                            action={
                                <>
                            {
                                actions && actions.length > 0 && 
                                (
                                    <>
                                        <IconButton
                                            id="card-buttons"
                                            aria-controls={openActions ? 'card-menus' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={openActions ? 'true' : undefined}
                                            onClick={(event) => {
                                                setActionsAnchorEl(event.currentTarget);
                                            }}
                                        >
                                            <MoreVertIcon/>
                                        </IconButton>
                                        <Menu
                                            id="card-menus"
                                            anchorEl={actionsAnchorEl}
                                            open={openActions}
                                            onClose={() => {
                                                setActionsAnchorEl(null);
                                            }}
                                            MenuListProps={{
                                                'aria-labelledby': 'card-buttons',
                                            }}
                                        >
                                            {
                                                actions.map((r,i) => (
                                                    <MenuItem
                                                        key={`m${r.label}-${i}`}
                                                        onClick={r.onClick}
                                                        disabled={r.disabled}
                                                    >
                                                    {r.label}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Menu>
                                    </>
                                )
                                }</>
                            }
                        />
                    </>
                )
            }
            {
                sectioned ? (<CardContent sx={{height: height}}> {children} </CardContent>) : (children)
            }
        </Card>
    )
}

LegacyCard.Section = ({title, content = null, children, spacing=2, stacked, direction = "column", divider}) => {

    return (
        <>
            {
                title && (
                    <>
                        <Divider/>
                        <CardHeader
                            sx={{pb: 0, mb: 0}}
                            title={title}
                            titleTypographyProps={{
                                variant: 'h6'
                            }}
                            subheader={content}
                        />
                    </>
                )
            }
            {
                (!title && divider) && (
                    <>
                        <Divider/>
                    </>
                )
            }
            {
                stacked? (
                    <CardContent>
                        <Stack spacing={spacing} direction={direction}>
                            {children}
                        </Stack>
                    </CardContent>
                ):(<CardContent> {children} </CardContent>)
            }
        </>
    )
}

export default LegacyCard;