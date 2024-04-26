import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { Container, Divider, ListItemIcon, Stack, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ModeNightRoundedIcon from '@mui/icons-material/ModeNightRounded';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import route_names from '../../routes/route_names';
import { useAuth, usePrivileges } from '../../providers/AuthProvider';
import Logo from './Logo';
import { NameAvatar } from '../../components/CustomAvatar';
import { useThemeMode } from '..';
import { TopNav } from './TopNav';
import privileges from '../../privileges';

const AppTopBar = (props) => {
  const { onNavOpen } = props;

  const { hasPermission } = usePrivileges();
  
  const theme = useTheme();
  const colorMode = useThemeMode();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        sx={{minWidth: 240}}
        disableRipple
        disableTouchRipple
      >
        <ListItemIcon>
          <NameAvatar name={user?.fullName}/>
        </ListItemIcon>
        <Stack ml={2} direction="column" spacing={0}>
          <Typography>
            {user?.fullName}
          </Typography>
          <Typography variant="caption">
            {user?.email}
          </Typography>
        </Stack>
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          handleMobileMenuClose();
          navigate(route_names.myaccount);
        }}
      >
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <Typography>
          Profile
        </Typography>
      </MenuItem>
      {
        hasPermission(privileges['staff.manage']) && <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleMobileMenuClose();
            navigate(route_names['management.staff']);
          }}
        >
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <Typography>
            My Team
          </Typography>
        </MenuItem>
      }
      <Divider />
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          handleMobileMenuClose();
          logout();
        }}
      >
        <ListItemIcon>
          <Logout color="error" />
        </ListItemIcon>
        <Typography color={theme => theme.palette.error.main}>
          Logout
        </Typography>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(route_names.myaccount);
        }}
        sx={{minWidth: 240}}
      >
        <ListItemIcon>
          <NameAvatar name={user?.fullName}/>
        </ListItemIcon>
        <Stack ml={2} direction="column" spacing={0}>
          <Typography>
            {user?.fullName}
          </Typography>
          <Typography variant="caption">
            {user?.email}
          </Typography>
        </Stack>
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          handleMobileMenuClose();
          logout();
        }}
      >
        <ListItemIcon>
          <Logout color="error" />
        </ListItemIcon>
        <Typography color={theme => theme.palette.error.main}>
          Logout
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo>
          {
            !lgUp && (<IconButton
              onClick={onNavOpen}
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>)
          }
          </Logo>
          <TopNav />
          <Box sx={{ flexGrow: 1 }} />
            <Tooltip title={theme.palette.mode === 'dark' ?"Switch to light mode":"Switch to dark mode"}>
              <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === "dark" ? <WbSunnyRoundedIcon /> : <ModeNightRoundedIcon />}
              </IconButton>
            </Tooltip>
          <Box sx={{ display: { md: 'flex' } }}>
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Stack spacing={1} direction="row" alignItems="center">
                  <NameAvatar name={user?.fullName}></NameAvatar>
                </Stack>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
        </Container>
      </AppBar>
      {renderMenu}
      {renderMobileMenu}
    </>
  );
}

export default AppTopBar;