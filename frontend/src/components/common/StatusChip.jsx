import { Chip } from '@mui/material';

const StatusChip = ({status}) => {
    const color = status?.includes('архив') ? '#388E3C'
        : status?.includes('потпиш') ? '#1565C0'
            : status?.includes('чека') ? '#E65100'
                : '#666';
    return (
        <Chip label={status || '—'} size="small"
              sx={{bgcolor: color + '18', color, fontSize: '0.65rem',
                  fontWeight: 600, height: 20, maxWidth: 180,minWidth:180}}
        />
    );
};

export default StatusChip;
