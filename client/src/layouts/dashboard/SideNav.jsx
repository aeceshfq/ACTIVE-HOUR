import PropTypes from 'prop-types';
import { Box, Divider, Drawer, IconButton, List, styled, useMediaQuery } from '@mui/material';
import CustomMenuItem from '../../components/CustomMenuItem';
import Logo from './Logo';
import CloseIcon from '@mui/icons-material/Close';
import { navigation } from '../../routes/navigations';
import { useAuth, usePrivileges } from '../../providers/AuthProvider';
import LogoutIcon from '@mui/icons-material/Logout';
import { blueGrey, common } from '@mui/material/colors';

export const SideNav = ({ open, onClose, drawerWidth }) => {
    const { logout } = useAuth();
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const { hasPermission } = usePrivileges();

    const DrawerHeader = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar
    }));

    const content = (
        <Box sx={{ overflow: 'auto', mt: (theme) => `${lgUp ? theme.mixins.toolbar.height : 0}` }}>
            {
                !lgUp && (
                    <div>
                        <DrawerHeader>
                            <Logo>
                                <IconButton onClick={onClose}
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    sx={{ mr: 1  }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Logo>
                        </DrawerHeader>
                        <Divider />
                    </div>
                )
            }
            <NavMenu onClose={onClose} hasPermission={hasPermission} logout={logout}></NavMenu>
        </Box>
    );

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            variant="temporary"
            sx={{
                zIndex: (theme) => theme.zIndex.appBar + 200,
                width: drawerWidth,
                [`& .MuiPaper-root`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRadius: "0px !important"
                }
            }}
        >
            {content}
        </Drawer>
    );
};

SideNav.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};

const CustomNavBar = styled(List)({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    }
});


function NavMenu({onClose, hasPermission, logout}) {
    let navs = navigation.filter(r => r.isMenu === true || r.type === "divider" || r.type === "heading");
    //rearrange the menu based on position
    navs.sort((a, b) => a.position - b.position);
    let leftMenu = [];
    for (let index = 0; index < navs.length; index++) {
        const item = navs[index];
        if (item.isMenu) {
            const has_permission = hasPermission(item.permissions);
            if (!has_permission) {
                continue;
            }
        }
        leftMenu.push(
            <CustomMenuItem
                key={`sniy${index}`}
                index={index}
                title={item.title}
                icon={item.icon}
                divider={item.type === 'divider'}
                heading={item.type === 'heading'}
                path={item.path}
                subMenu={item.submenu}
                onSelect={onClose}
            />
        )
    }
    return (
        <CustomNavBar component="nav" aria-label="main menu" dense>
            {leftMenu}
        </CustomNavBar>
    )
}