import { Autocomplete, TextField } from '@mui/material';

// Dropdown-филтер во заглавие на колона (изглед идентичен на DemoApp автокомплетот)
const ColDropdown = ({value, onChange, options, getLabel, getId, placeholder}) => {
    const selected = options.find(o => getId(o) === value) || null;

    return (
        <Autocomplete
            value={selected}
            onChange={(_, newValue) => onChange(newValue ? getId(newValue) : '')}
            onClick={(e) => e.stopPropagation()}
            options={options}
            getOptionLabel={(o) => getLabel(o) || ''}
            isOptionEqualToValue={(o, v) => getId(o) === getId(v)}
            noOptionsText="Нема резултати"
            size="small"
            sx={{
                '& .MuiAutocomplete-option': {fontSize: '0.78rem'},
                '& .MuiOutlinedInput-root': {bgcolor: '#fff', borderRadius: '6px', fontSize: '0.75rem'},
                '& .MuiOutlinedInput-notchedOutline': {border: 'none'},
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    placeholder={placeholder}
                />
            )}
        />
    );
};

export default ColDropdown;
