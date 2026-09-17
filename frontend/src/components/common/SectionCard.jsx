import { Card, CardHeader, CardContent, Typography } from '@mui/material';

const SectionCard = ({title, children, noPad = false}) => (
    <Card sx={{marginBottom: '3px'}}>
        <CardHeader
            sx={{
                maxHeight: '5px',
                background: 'linear-gradient(240deg, #FFFFFF 0%, #dbbd5e 70%, #A9A085 100%)',
                borderRadius: '0% 100% 100% 0% / 50% 50% 50% 50%',
            }}
            title={
                <Typography variant="subtitle1" color="#FFFFFF">
                    {title}
                </Typography>
            }
        />
        <CardContent sx={noPad ? {p: 0, '&:last-child': {pb: 0}} : undefined}>
            {children}
        </CardContent>
    </Card>
);

export default SectionCard;
