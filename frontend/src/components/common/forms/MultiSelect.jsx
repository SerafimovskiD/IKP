import { Autocomplete, Checkbox, Chip, FormControl, TextField } from '@mui/material';
import ErrorText from './ErrorText.jsx';

// Мулти-dropdown со checkbox опции и chip-ови (изглед идентичен на DemoApp автокомплетот)
const MultiSelect = ({label, value, onChange, options, getLabel, getId, error, theme, fullWidth, minWidth = 260}) => {
    const selected = options.filter(o => value.includes(getId(o)));

    return (
        <FormControl size="small" error={!!error} sx={{minWidth: '300px', maxWidth: '300px'}}>
            <Autocomplete
                multiple
                disableCloseOnSelect
                filterSelectedOptions
                value={selected}
                onChange={(_, newValue) => onChange(newValue.map(getId))}
                options={options}
                getOptionLabel={(o) => getLabel(o) || ''}
                isOptionEqualToValue={(o, v) => getId(o) === getId(v)}
                noOptionsText="Нема резултати"
                renderOption={(props, option, {selected: isSelected}) => {
                    const {key, ...rest} = props;
                    return (
                        <li key={key} {...rest}>
                            {/*<Checkbox checked={isSelected} size="small" sx={{mr: 1, p: 0.5}}/>*/}
                            {getLabel(option)}
                        </li>
                    );
                }}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                        const {key, ...tagProps} = getTagProps({index});
                        return (
                            <Chip key={key} {...tagProps} label={getLabel(option)} size="small"
                                  sx={{bgcolor: theme?.chipBg || '#F5F5F5', color: theme?.chipColor || '#333',
                                      fontSize: '0.68rem', height: 20, fontWeight: 500}}
                            />
                        );
                    })
                }
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

export default MultiSelect;
