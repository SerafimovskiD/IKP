import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#826f35',
        },
        secondary: {
            main: '#b6a268',
        },
    },
    components: {
        MuiTextField: {
            defaultProps: {
                size: 'small',
                margin: 'dense',
            },
        },
        MuiFormControl: {
            defaultProps: {
                size: 'small',
                margin: 'dense',
            },
        },
        MuiSelect: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
        },
    },
});

export default theme;
