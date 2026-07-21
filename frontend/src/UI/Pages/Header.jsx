import { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Box, IconButton,
    Badge, Menu, MenuItem, Divider, Avatar
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext.jsx';

// const MKFlag = () => (
//     <Box sx={{
//         width: 52, height: 36,
//         borderRadius: '3px',
//         overflow: 'hidden',
//         flexShrink: 0,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         bgcolor: '#CE2028',
//         border: '1px solid rgba(255,255,255,0.2)'
//     }}>
//         <svg viewBox="0 0 52 36" width="52" height="36" xmlns="http://www.w3.org/2000/svg">
//             <rect width="52" height="36" fill="#CE2028"/>
//             {/* Сончеви зраци */}
//             <line x1="26" y1="18" x2="0" y2="0" stroke="#FFD700" strokeWidth="2"/>
//             <line x1="26" y1="18" x2="52" y2="0" stroke="#FFD700" strokeWidth="2"/>
//             <line x1="26" y1="18" x2="0" y2="36" stroke="#FFD700" strokeWidth="2"/>
//             <line x1="26" y1="18" x2="52" y2="36" stroke="#FFD700" strokeWidth="2"/>
//             <line x1="26" y1="18" x2="26" y2="0" stroke="#FFD700" strokeWidth="2"/>
//             <line x1="26" y1="18" x2="26" y2="36" stroke="#FFD700" strokeWidth="2"/>
//             <line x1="26" y1="18" x2="0" y2="18" stroke="#FFD700" strokeWidth="2"/>
//             <line x1="26" y1="18" x2="52" y2="18" stroke="#FFD700" strokeWidth="2"/>
//             {/* Сонце */}
//             <circle cx="26" cy="18" r="6" fill="#FFD700"/>
//             <circle cx="26" cy="18" r="3.5" fill="#CE2028"/>
//         </svg>
//     </Box>
// );

const Header = ({ onMenuToggle }) => {
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
            elevation={0}
            sx={{
                bgcolor: '#7B0D1E',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ minHeight: '52px !important', px: 2, gap: 1.5 }}>

                {/* Хамбургер — за мобилен */}
                <IconButton
                    sx={{ color: '#fff', p: 0.5, mr: 0.5 }}
                >
                    <MenuIcon fontSize="small"/>
                </IconButton>


                {/* Наслов */}
                <Box sx={{
                    width: 48,
                    height: 32,
                    flexShrink: 0,
                    overflow: 'hidden',
                    borderRadius: '2px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <img
                        src={'mkdFlag.jpg'}
                        alt={"mkdFlag"}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                </Box>

                <Typography sx={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '1rem',
                    letterSpacing: '0.08em',
                    flex: 1,
                    ml: 0.5
                }}>
                    Dashboard
                </Typography>

                {/* Иконки десно */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

                    {/* Пребарување */}
                    <IconButton sx={{ color: 'rgba(255,255,255,0.85)', p: 0.8 }}>
                        <PersonIcon sx={{ fontSize: 20 }}/>
                    </IconButton>

                    {/* Нотификации */}
                    <IconButton sx={{ color: 'rgba(255,255,255,0.85)', p: 0.8 }}>
                        <Badge badgeContent={0} color="error">
                            <NotificationsIcon sx={{ fontSize: 20 }}/>
                        </Badge>
                    </IconButton>

                    {/* Корисник */}
                    <Box
                        onClick={handleMenuOpen}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            ml: 0.5,
                            px: 1,
                            py: 0.5,
                            borderRadius: '4px',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        <Typography sx={{
                            color: '#fff',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            display: { xs: 'none', sm: 'block' }
                        }}>
                            {fullName}
                        </Typography>
                        <Avatar sx={{
                            width: 30, height: 30,
                            bgcolor: 'rgba(255,255,255,0.25)',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                        }}>
                            {initials}
                        </Avatar>
                    </Box>
                </Box>

                {/* Dropdown мени за корисник */}
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
                    <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, py: 1 }}>
                        <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }}/>
                        <Typography fontSize="0.875rem">Профил</Typography>
                    </MenuItem>
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