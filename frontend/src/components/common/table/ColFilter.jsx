import { TextField } from '@mui/material';

// Текст-филтер во заглавие на колона
const ColFilter = ({value, onChange, placeholder = '...'}) => (
    <TextField
        variant="outlined"
        size="small" fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        sx={{
            '& .MuiOutlinedInput-root': {
                fontSize: '0.75rem',
                bgcolor: '#fff',
                borderRadius: '6px',
                '& input': {py:1, px: 1},
            },
            '& .MuiOutlinedInput-notchedOutline': {border: 'none'},
        }}
    />
);

export default ColFilter;
