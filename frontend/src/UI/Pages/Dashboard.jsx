import { Box, Typography } from '@mui/material';

const Dashboard = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 52px)',
            bgcolor: '#fff',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
            }}>
                {/* Лого во круг */}
                <Box sx={{
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#fff',
                }}>
                    <Box
                        component="img"
                        src="/logo.png"
                        alt="МВР Лого"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>

                {/* Текст */}
                <Box sx={{textAlign: 'center'}}>
                    <Typography sx={{
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: '#1A1A2E',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        mb: 0.8
                    }}>
                        Интерна книга на пошта
                    </Typography>
                    <Typography sx={{
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: '#555',
                        letterSpacing: '0.02em',
                    }}>
                        Министерство за внатрешни работи
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;