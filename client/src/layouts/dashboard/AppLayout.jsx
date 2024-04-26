import Box from '@mui/material/Box';
import AppTopBar from './AppTopBar';
import { useMediaQuery } from '@mui/material';
import { SideNav } from './SideNav';
import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import AuthRoutes from '../../auth/AuthRoutes';
const drawerWidth = 240;

const AppLayout = ((props) => {
    const { children } = props;
    const [openNav, setOpenNav] = useState(false);
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return (
            <div>
                <AuthRoutes />
            </div>
        );
    }

    return (
        <>
            <AppTopBar
                drawerWidth={drawerWidth}
                onNavOpen={() => setOpenNav(true)}
            />
            <SideNav
                drawerWidth={drawerWidth}
                onClose={() => setOpenNav(false)}
                open={openNav}
            />
            <Box
                component="main"
                sx={{
                    // width: lgUp?`calc(100% - ${drawerWidth}px)`:`calc(100%)`,
                    // marginLeft: lgUp?`${drawerWidth}px`:`0px`,
                    mt: 9
                }}
            >
               {children}
            </Box>
        </>
    );
})

export default AppLayout;