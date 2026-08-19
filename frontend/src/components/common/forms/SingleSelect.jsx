import { Autocomplete, FormControl, TextField } from '@mui/material';
import ErrorText from './ErrorText.jsx';

// Dropdown со search (изглед идентичен на DemoApp автокомплетот)
const SingleSelect = ({label, value, onChange, options, getLabel, getId, error, size = 'small', fullWidth}) => {
    const selected = options.find(o => getId(o) === value) || null;

    return (
        <FormControl size={size} error={!!error}
                     sx={fullWidth ? {width: '100%'} : {minWidth: '300px', maxWidth: '300px'}}>
            <Autocomplete
                value={selected}
                onChange={(_, newValue) => onChange(newValue ? getId(newValue) : '')}
                options={options}
                getOptionLabel={(o) => getLabel(o) || ''}
                isOptionEqualToValue={(o, v) => getId(o) === getId(v)}
                noOptionsText="Нема резултати"
                sx={{
                    '& .MuiAutocomplete-option': {fontSize: '0.85rem'},
                    '& .MuiInputLabel-root': {fontSize: '14px'},
                    '& .MuiInputLabel-root.MuiInputLabel-shrink': {fontSize: '14px'},
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        margin="none"
                        label={label}
                        error={!!error}
                        InputLabelProps={{...params.InputLabelProps, shrink: true}}
                        sx={{'& .MuiInputBase-input': {fontSize: '0.85rem'}}}
                    />
                )}
            />
            <ErrorText msg={error}/>
        </FormControl>
    );
};

export default SingleSelect;
