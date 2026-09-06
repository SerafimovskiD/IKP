import { Box } from '@mui/material';

// Пилюли-филтер (радио група) во заглавие на колона - транспарентен, со бела
// линија под избраната опција (ист "underline" стил како ColFilter/ColDatePicker).
const ColRadio = ({value, onChange, options}) => (
    <Box sx={{
        display: 'flex', gap: 1.2, flexWrap: 'nowrap', mt: 1.6,
    }}>
        <Box
            onClick={() => onChange('')}
            sx={{
                fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                height: '26px',
                color: value === '' ? '#fff' : 'rgba(255,255,255,0.65)',
                borderBottom: value === '' ? '1px solid #fff' : '2px solid transparent', pb:0.3,
                '&:hover': {color: '#fff'}
            }}
        >
            Сите
        </Box>
        {options.map(opt => (
            <Box key={opt.value}
                 onClick={() => onChange(value === opt.value ? '' : opt.value)}
                 sx={{
                     fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                     color: value === opt.value ? '#fff' : 'rgba(255,255,255,0.65)',
                     borderBottom: value === opt.value ? '2px solid #fff' : '2px solid transparent',
                     '&:hover': {color: '#fff'}
                 }}
            >
                {opt.label}
            </Box>
        ))}
    </Box>
);

export default ColRadio;
