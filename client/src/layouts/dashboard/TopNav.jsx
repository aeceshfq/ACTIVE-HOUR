import { Box, ListItemButton, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';
import { navigation } from '../../routes/navigations';
import { usePrivileges } from '../../providers/AuthProvider';
import { useMatch, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const TopNav = ({ }) => {
    const { hasPermission } = usePrivileges();
    return (
        <NavMenu hasPermission={hasPermission}></NavMenu>
    );
};

function NavMenu({ hasPermission }) {
    let navs = navigation.filter(r => r.isMenu === true);
    //rearrange the menu based on position
    navs.sort((a, b) => a.position - b.position);
    let topMenuItems = [];
    for (let index = 0; index < navs.length; index++) {
        const item = navs[index];
        if(!item.isMenu) continue;
        const has_permission = hasPermission(item.permissions);
        if (!has_permission) {
            continue;
        }
        topMenuItems.push(
            <CustomMenuItem
                key={item.title} 
                path={item.path}
                title={item.title}
                icon={item.icon}
            />
        )
    }
    return (
        <Box sx={{ display: { xs: 'none', md: "none", lg: "flex", xl: "flex" }, ml: 4 }}>
            {topMenuItems}
        </Box>
    )
}

function CustomMenuItem({ active, title, icon, path, onSelect }){

    const navigate = useNavigate();
    const match = useMatch(`${path}/*`);
    const [isActive, setIsActive] = useState(active?true:match?true:false);

    useEffect(() => {
        setIsActive(active?true:match?true:false);
    }, [match, active]);

    return(
        <MenuItem
            onClick={() => {
                navigate(path);
                if (typeof onSelect === "function") {
                    onSelect(path);
                }
            }}
            selected={isActive}
        >
            <ListItemText>{title}</ListItemText>
        </MenuItem>
    )
}