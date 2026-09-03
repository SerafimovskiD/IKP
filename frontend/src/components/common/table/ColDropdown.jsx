import { Autocomplete, TextField } from '@mui/material';

// Dropdown-филтер во заглавие на колона - транспарентен, само линија под полето
// (ист "underline" стил како ColFilter/ColRadio).
// groupBy (опционално) - за колони кои спојуваат опции од две различни листи
// (пр. "Предмет" ги спојува vidPredmetDobiena и vidPredmetIspratena) - им става
// видлив наслов на групата за да не се мешаат едни со други.
const ColDropdown = ({value, onChange, options, getLabel, getId, placeholder, groupBy}) => {
    const selected = options.find(o => getId(o) === value) || null;

    return (
        <Autocomplete
            value={selected}
            onChange={(_, newValue) => onChange(newValue ? getId(newValue) : '', newValue)}
            onClick={(e) => e.stopPropagation()}
            options={options}
            groupBy={groupBy}
            getOptionLabel={(o) => getLabel(o) || ''}
            isOptionEqualToValue={(o, v) => getId(o) === getId(v)}
            noOptionsText="Нема резултати"
            size="small"
            sx={{
                '& .MuiAutocomplete-option': {fontSize: '0.78rem'},
                '& .MuiAutocomplete-groupLabel': {
                    fontSize: '0.72rem', fontWeight: 700, color: '#826f35',
                    lineHeight: 2,
                },
                '& .MuiInput-root': {
                    fontSize: '0.75rem', color: '#fff',
                    '&:before': {borderBottom: '1.5px solid rgba(255,255,255,0.8)'},
                    '&:hover:not(.Mui-disabled):before': {borderBottom: '1.5px solid #fff'},
                    '&:after': {borderBottom: '2px solid #fff'},
                },
                '& .MuiInput-input::placeholder': {color: 'rgba(255,255,255,0.75)', opacity: 1},
                '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {color: 'rgba(255,255,255,0.85)'},
                '& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root': {color: 'rgba(255,255,255,0.85)'},
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    size="small"
                    placeholder={placeholder}
                />
            )}
        />
    );
};

export default ColDropdown;
