import { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Box, IconButton,
    Badge, Menu, MenuItem, Divider, Avatar
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Header = ({ title, onMenuToggle }) => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        handleMenuClose();
        await logout();
    };

    const fullName = user ? `${user.ime} ${user.prezime}` : 'Корисник';
    const initials = user ? `${user.ime?.[0] || ''}${user.prezime?.[0] || ''}` : 'К';

    return (
        <AppBar
            position="fixed"
            sx={{
                background: 'linear-gradient(240deg, #a70023 0%, #610017 70%, #780004 100%)',
                zIndex: (theme) => theme.zIndex.modal,
            }}
        >
            <Toolbar>

                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={onMenuToggle}
                    edge="start"
                    sx={{ mr: 1 }}
                >
                    <MenuIcon/>
                </IconButton>

                <img
                    alt="flag"
                    width="180"
                    height="62"
                    className="flag"
                    src={'/mk-flag.jpg'}
                />

                <Link
                    to="/dashboard"
                    style={{ textDecoration: 'none', marginLeft: '15px' }}
                >
                    <Typography
                        component="span"
                        variant="h6"
                        noWrap
                        style={{ color: 'white' }}
                    >
                        ИНТЕРНА КНИГА НА ПОШТА
                    </Typography>
                </Link>

                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1, ml: 4 }}
                >
                    {title || ''}
                </Typography>



                <Typography align="right" sx={{ color: '#fff', mr: 1 }}>
                    {fullName}
                </Typography>

                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                    <Avatar sx={{
                        width: 32, height: 32,
                        bgcolor: 'rgba(255,255,255,0.25)',
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        {initials}
                    </Avatar>
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: {
                            mt: 0.5, minWidth: 200,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                        }
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {fullName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                            {user?.uloga || ''}
                        </Typography>
                    </Box>
                    <Divider/>
                    <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1, color: 'error.main' }}>
                        <LogoutIcon fontSize="small"/>
                        <Typography fontSize="0.875rem">Одјави се</Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;