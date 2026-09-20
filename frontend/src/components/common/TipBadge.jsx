import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import OutboxIcon from '@mui/icons-material/Outbox';

const TipBadge = ({tip}) => {
    const isDobiena = tip === 'Dobiena';
    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.4}}>
            {isDobiena
                ? <InboxIcon sx={{fontSize: 13, color: '#C8A84B'}}/>
                : <OutboxIcon sx={{fontSize: 13, color: '#388E3C'}}/>
            }
            <Typography sx={{fontSize: '0.72rem', color: isDobiena ? '#8B6914' : '#1B5E20', fontWeight: 600}}>
                {isDobiena ? 'Добиена' : 'Испратена'}
            </Typography>
        </Box>
    );
};

export default TipBadge;
