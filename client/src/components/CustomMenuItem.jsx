import { Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

export default function CustomMenuItem({ active, title, icon, path, subMenu, divider, onSelect, heading }){

    const navigate = useNavigate();
    const match = useMatch(`${path}/*`);
    const [isActive, setIsActive] = useState(active?true:match?true:false);

    useEffect(() => {
        setIsActive(active?true:match?true:false);
    }, [match, active]);

    if (divider) {
        return (
            <Divider sx={{mt: 1, mb:1}}/>
        )
    }

    if (heading) {
        return (
            <ListSubheader id={title} title={title}>
                {title}
            </ListSubheader>
        )
    }

    return(
        <>
            <ListItemButton
                selected={isActive}
                onClick={() => {
                    navigate(path);
                    if (typeof onSelect === "function") {
                        onSelect(path);
                    }
                }}
                sx={{
                    color: isActive?"primary.main":""
                }}
            >
                <ListItemIcon
                    sx={{
                        color: isActive?"primary.main":""
                    }} 
                >
                    {icon}
                </ListItemIcon>
                <ListItemText>
                    {title}
                </ListItemText>
            </ListItemButton>
            {
                subMenu && subMenu?.length > 0 && (
                    <Collapse in={match?true:false} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding dense>
                            {
                                subMenu.map((subitem, inx) => (
                                    subitem.isMenu?<SubMenuItem
                                        key={`submenui-${inx}`}
                                        path={subitem.path}
                                        title={subitem.title}
                                    />:null
                                ))
                            }
                        </List>
                    </Collapse>
                )
            }
        </>
    )
}

export function SubMenuItem({ title, path, divider }){

    const navigate = useNavigate();
    const match = useMatch(path);

    if (divider) {
        return (
            <Divider />
        )
    }

    return(
        <ListItemButton
            // selected={match?true:false}
            sx={{
                color: match?"primary.main":""
            }}
            onClick={() => {
                navigate(path);
            }}
        >
            <ListItemText
                sx={{pl: 5}}
            >
                {title}
            </ListItemText>
        </ListItemButton>
    )
}