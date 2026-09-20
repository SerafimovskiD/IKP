import { Typography } from '@mui/material';

const ErrorText = ({msg}) => (
    <Typography sx={{
        color: '#d32f2f',
        fontSize: '0.68rem',
        mt: 0.3,
        minHeight: '1rem',
        visibility: msg ? 'visible' : 'hidden'
    }}>
        {msg || ' '}
    </Typography>
);

export default ErrorText;
