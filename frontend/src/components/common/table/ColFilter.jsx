import { TextField } from '@mui/material';

// Текст-филтер во заглавие на колона - транспарентен, само линија под полето
// (се стопува со златната позадина на заглавието).
const ColFilter = ({value, onChange, placeholder = '...'}) => (
    <TextField
        variant="standard"
        size="small" fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        InputProps={{disableUnderline: false}}
        sx={{
            '& .MuiInput-root': {
                fontSize: '0.75rem',
                color: '#fff',
                '&:before': {borderBottom: '1.5px solid rgba(255,255,255,0.8)'},
                '&:hover:not(.Mui-disabled):before': {borderBottom: '1.5px solid #fff'},
                '&:after': {borderBottom: '2px solid #fff'},
            },
            '& .MuiInput-input': {py: 0.5, px: 0.25},
            '& .MuiInput-input::placeholder': {color: 'rgba(255,255,255,0.75)', opacity: 1},
        }}
    />
);

export default ColFilter;
