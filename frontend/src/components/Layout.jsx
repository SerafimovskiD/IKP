import { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider, Collapse } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header.jsx';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InboxIcon from '@mui/icons-material/Inbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';

const SIDEBAR_WIDTH = 220;

const TITLES = {
    '/dashboard': 'Почетна',
    '/createPosta/nova': 'Нов предмет',
    '/posta': 'Детали на предмет',
    '/search': 'Пребарување',
};

const NAV = [
    {
        label: 'ВНЕС НА ПОДАТОЦИ',
        items: [
            {
                label: 'Добиена пошта',
                icon: <InboxIcon sx={{fontSize: 18}}/>,
                children: [
                    {label: 'Нов предмет', path: '/createPosta/nova?tipDelovnik=Dobiena', icon: <AddCircleOutlineIcon sx={{fontSize: 16}}/>},
                    {label: 'Преглед', path: '/predmeti?tipDelovnik=Dobiena', icon: <ListAltIcon sx={{fontSize: 16}}/>},
                ]
            },
            {
                label: 'Испратена пошта',
                icon: <OutboxIcon sx={{fontSize: 18}}/>,
                children: [
                    {label: 'Нов предмет', path: '/createPosta/nova?tipDelovnik=Ispratena', icon: <AddCircleOutlineIcon sx={{fontSize: 16}}/>},
                    {label: 'Преглед', path: '/predmeti?tipDelovnik=Ispratena', icon: <ListAltIcon sx={{fontSize: 16}}/>},
                ]
            },
        ]
    },
    {
        label: 'ПРЕБАРУВАЊЕ',
        items: [
            {label: 'Пребарување', icon: <SearchIcon sx={{fontSize: 18}}/>, path: '/search'},
        ]
    }
];

const SidebarItem = ({item, depth = 0}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path && location.pathname + location.search === item.path
        || item.path && location.pathname === item.path.split('?')[0];

    return (
        <>
            <ListItemButton
                onClick={() => hasChildren ? setOpen(!open) : navigate(item.path)}
                sx={{
                    pl: depth === 0 ? 2 : 3.5,
                    py: 0.7,
                    borderRadius: '4px',
                    mx: 0.5,
                    mb: 0.2,
                    bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': {bgcolor: 'rgba(255,255,255,0.1)'},
                }}
            >
                <ListItemIcon sx={{minWidth: 28, color: isActive ? '#fff' : 'rgba(255,255,255,0.7)'}}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                        fontSize: depth === 0 ? '0.82rem' : '0.78rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                    }}
                />
                {hasChildren && (
                    open
                        ? <ExpandLess sx={{fontSize: 16, color: 'rgba(255,255,255,0.6)'}}/>
                        : <ExpandMore sx={{fontSize: 16, color: 'rgba(255,255,255,0.6)'}}/>
                )}
            </ListItemButton>

            {hasChildren && (
                <Collapse in={open} timeout="auto">
                    <List disablePadding>
                        {item.children.map(child => (
                            <SidebarItem key={child.label} item={child} depth={depth + 1}/>
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

const Layout = ({children}) => {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const title = Object.entries(TITLES).find(([key]) =>
        location.pathname.startsWith(key)
    )?.[1] || 'ИКП';

    const sidebar = (
        <Box sx={{
            height: '100%',
            bgcolor: '#7B0D1E',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Logo area */}
            <Box sx={{
                px: 2, py: 1.5,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', gap: 1,
                minHeight: 52
            }}>
                <Typography sx={{
                    color: '#fff', fontWeight: 700,
                    fontSize: '0.75rem', letterSpacing: '0.05em'
                }}>
                    ИКП — МВР
                </Typography>
            </Box>

            {/* Nav */}
            <Box sx={{flex: 1, overflowY: 'auto', py: 1}}>
                {NAV.map((group) => (
                    <Box key={group.label} sx={{mb: 1}}>
                        <Typography sx={{
                            px: 2, py: 0.5,
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.4)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase'
                        }}>
                            {group.label}
                        </Typography>
                        <List disablePadding>
                            {group.items.map(item => (
                                <SidebarItem key={item.label} item={item}/>
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>

            {/* Bottom */}
            <Box sx={{
                px: 2, py: 1.5,
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Typography sx={{fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)'}}>
                    v1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{display: 'flex', minHeight: '100vh'}}>

            {/* Desktop sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    display: {xs: 'none', sm: 'block'},
                    '& .MuiDrawer-paper': {
                        width: SIDEBAR_WIDTH,
                        boxSizing: 'border-box',
                        border: 'none',
                        top: 0,
                    },
                }}
            >
                {sidebar}
            </Drawer>

            {/* Mobile sidebar */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                    display: {xs: 'block', sm: 'none'},
                    '& .MuiDrawer-paper': {width: SIDEBAR_WIDTH}
                }}
            >
                {sidebar}
            </Drawer>

            {/* Main content */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                bgcolor: '#F5F5F5'
            }}>
                {/* Header */}
                <Header
                    title={title}
                    onMenuToggle={() => setMobileOpen(!mobileOpen)}
                />

                {/* Page content */}
                <Box sx={{
                    flex: 1,
                    mt: '52px',
                    overflow: 'auto'
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;