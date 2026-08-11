import { Box } from '@mui/material';

// Пилюли-филтер (радио група) во заглавие на колона
const ColRadio = ({value, onChange, options}) => (
    <Box sx={{
        display: 'flex', gap: 0.3, flexWrap: 'nowrap',
        bgcolor: '#fff', borderRadius: '6px', p: 0.25,mt:1.6,
    }}>
        <Box
            onClick={() => onChange('')}
            sx={{
                fontSize: '0.68rem', fontWeight: 600, px: 0.9, py: 0.4,
                borderRadius: '4px', cursor: 'pointer', transition: 'all 0.15s',
                bgcolor: value === '' ? '#826f35' : 'transparent',
                color: value === '' ? '#fff' : '#888',
                '&:hover': {bgcolor: value === '' ? '#826f35' : '#F0F0F0'}
            }}
        >
            Сите
        </Box>
        {options.map(opt => (
            <Box key={opt.value}
                 onClick={() => onChange(value === opt.value ? '' : opt.value)}
                 sx={{
                     fontSize: '0.68rem', fontWeight: 600, px: 0.9, py: 0.4,
                     borderRadius: '4px', cursor: 'pointer', transition: 'all 0.15s',
                     bgcolor: value === opt.value ? '#826f35' : 'transparent',
                     color: value === opt.value ? '#fff' : '#888',
                     '&:hover': {bgcolor: value === opt.value ? '#826f35' : '#F0F0F0'}
                 }}
            >
                {opt.label}
            </Box>
        ))}
    </Box>
);

export default ColRadio;
