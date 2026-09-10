import { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header.jsx';

import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const drawerWidth = 240;

// const TITLES = {
//     '/dashboard': 'Почетна',
//     '/createPosta/nova': 'Нов предмет',
//     '/posta': 'Детали на предмет',
//     '/listaPosta': 'Листа на предмети',
//     '/search': 'Пребарување',
// };

const NAV = [
    {
        label: 'ДОБИЕНА ПОШТА',
        icon: <CreateNewFolderTwoToneIcon/>,
        path: '/createPosta/nova?tipDelovnik=Dobiena',
    },
    {
        label: 'ИСПРАТЕНА ПОШТА',
        icon: <CreateNewFolderTwoToneIcon/>,
        path: '/createPosta/nova?tipDelovnik=Ispratena',
    },
    {
        label: 'ПРЕБАРУВАЊЕ',
        icon: <TravelExploreIcon/>,
        path: '/listaPosta',
    },
];

const drawerClasses = {
    listItemButton: {
        paddingTop: '3px',
        paddingBottom: '3px',
        '&.Mui-selected': {
            backgroundColor: '#b6a268',
        },
        '&.Mui-selected:hover': {
            backgroundColor: '#b6a268',
        },
    },
    listItemText: {
        marginLeft: '-15px',
    },
};

const DrawerItem = ({label, icon, selected, onClick}) => (
    <>
        <ListItemButton
            sx={drawerClasses.listItemButton}
            selected={selected}
            onClick={onClick}
        >
            {icon && <ListItemIcon sx={{color: '#a70023'}}>{icon}</ListItemIcon>}
            <ListItemText sx={drawerClasses.listItemText}>
                <Typography component="p" variant="subtitle2" color="inherit">
                    {label}
                </Typography>
            </ListItemText>
        </ListItemButton>
        <Divider/>
    </>
);

const Layout = ({children}) => {
    // const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // const title = Object.entries(TITLES).find(([key]) =>
    //     location.pathname.startsWith(key)
    // )?.[1] || 'ИКП';

    const navigate = useNavigate();
    const location = useLocation();

    const sidebar = (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <List sx={{
                width: `${drawerWidth}px`,
                '& .MuiListItemIcon-root': {
                    width: '2.25rem',
                    '& .MuiSvgIcon-root': {
                        fontSize: '1rem',
                    },
                },
            }}>
                {NAV.map(item => (
                    <DrawerItem
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        selected={location.pathname + location.search === item.path}
                        onClick={() => navigate(item.path)}
                    />
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{display: 'flex', height: '100vh', overflow: 'hidden'}}>

            {/* Desktop sidebar — се појавува/губи со клик на hamburger */}
            <Drawer
                variant="persistent"
                open={sidebarOpen}
                sx={{
                    width: sidebarOpen ? drawerWidth : 0,
                    flexShrink: 0,
                    display: {xs: 'none', sm: 'block'},
                    transition: (theme) => theme.transitions.create('width'),
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        border: 'none',
                        top: '64px',
                        maxHeight: 'calc(100vh - 64px)',
                        background: 'linear-gradient(240deg, #a70023 0%, #610017 70%, #780004 100%)',
                        color: 'white',
                        '& svg': {
                            color: 'white',
                        },
                    },
                }}
            >
                {sidebar}
            </Drawer>

            {/* Mobile sidebar */}
            <Drawer
                variant="temporary"
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                sx={{
                    display: {xs: 'block', sm: 'none'},
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: 'linear-gradient(240deg, #a70023 0%, #610017 70%, #780004 100%)',
                        color: 'white',
                        '& svg': {
                            color: 'white',
                        },
                    },
                }}
            >
                {sidebar}
            </Drawer>

            {/* Main */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                minHeight: 0,
                bgcolor: '#F2F4F7'
            }}>
                <Header
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <Box sx={{
                    flex: 1,
                    minHeight: 0,
                    mt: '64px',
                    height: 'calc(100vh - 64px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
