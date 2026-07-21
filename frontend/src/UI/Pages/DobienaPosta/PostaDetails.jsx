import {useState, useEffect} from 'react';
import {
    Box, Container, Typography, Grid,
    Button, Chip, Divider, CircularProgress
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {useParams} from "react-router-dom";
import usePredmetDetails from "../../../hooks/usePredmetiDetails.js";
import useIsprakjac from "../../../hooks/useIsprakjac.js";
import useArhiva from "../../../hooks/useArhiva.js";
import useVidPredmetDobieno from "../../../hooks/useVidPredmetDobieno.js";
import useVidPredmetIspratena from "../../../hooks/useVidPredmetIspratena.js";
import useUsersOdgovornoLice from "../../../hooks/useUsersOdgovornoLice.js";
import {useAuth} from "../../../context/AuthContext.jsx";
import useOrgEdinica from "../../../hooks/useOrgEdinica.js";

const DOBIENA_COLORS = {
    headerBg: '#E8C97A',
    sectionBg: '#FAE8B0',
    labelColor: '#8B4513',
    borderColor: '#C8A050',
    buttonBg: '#D4A843',
    chipBg: '#E8D8A0',
};

const ISPRATENA_COLORS = {
    headerBg: '#B8D9B0',
    sectionBg: '#E8F5E4',
    labelColor: '#2E6B2E',
    borderColor: '#7AB87A',
    buttonBg: '#5A9E5A',
    chipBg: '#C8E8C0',
};

const Label = ({children, color}) => (
    <Typography component="span"
                sx={{color: color || '#8B4513', fontWeight: 'bold', fontSize: '0.9rem'}}>
        {children}:
    </Typography>
);

const ValueBox = ({value, colors}) => (
    <Box sx={{
        bgcolor: '#fff',
        border: `1px solid ${colors.borderColor}`,
        borderRadius: '3px',
        px: 1.5, py: 0.8,
        minHeight: 36,
        display: 'flex',
        alignItems: 'center'
    }}>
        <Typography sx={{fontSize: '0.9rem', color: '#333'}}>
            {value || '—'}
        </Typography>
    </Box>
);

const FieldRow = ({label, children, colors}) => (
    <Grid container spacing={1} alignItems="flex-start" sx={{mb: 1.5}}>
        <Grid item xs={12} sm={3} sx={{pt: '10px !important'}}>
            <Label color={colors.labelColor}>{label}</Label>
        </Grid>
        <Grid item xs={12} sm={9}>{children}</Grid>
    </Grid>
);

const ActionButton = ({children, onClick, colors}) => (
    <Button fullWidth variant="contained" onClick={onClick}
            sx={{
                bgcolor: colors.buttonBg, color: '#fff',
                fontWeight: 'bold', fontSize: '0.8rem',
                '&:hover': {filter: 'brightness(0.9)'},
                textTransform: 'none', py: 1, lineHeight: 1.4
            }}>
        {children}
    </Button>
);

const PostaDetails = () => {
    const {id} = useParams();
    const {predmet, loading, error} = usePredmetDetails(id);

    const {isprakjaci} = useIsprakjac();
    const {arhiva} = useArhiva();
    const {vidPredmetD} = useVidPredmetDobieno();
    const {vidPredmetI} = useVidPredmetIspratena();
    const {odgovornoLice} = useUsersOdgovornoLice();
    const {user} = useAuth();
    const {getOrgEdinicaById} = useOrgEdinica();
    const [orgEdinica, setOrgEdinica] = useState(null);

    useEffect(() => {
        if (user?.organizaciskaEdinicaId) {
            getOrgEdinicaById(user.organizaciskaEdinicaId)
                .then(res => setOrgEdinica(res));
        }
    }, [user?.organizaciskaEdinicaId]);

    if (loading) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                minHeight: '60vh', gap: 2}}>
                <CircularProgress size={48}/>
                <Typography>Се вчитуваат податоците...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!predmet) return null;

    const isDobiena = predmet.tipDelovnik === "Dobiena";
    const COLORS = isDobiena ? DOBIENA_COLORS : ISPRATENA_COLORS;

    // Поврзани записи
    const isprakjac = isprakjaci?.find(i => i.id === predmet.isprakjacId);
    const odgovornoLiceList = (odgovornoLice || []).filter(u => predmet.odgovornoLiceId?.includes(u.id));
    const arhivaList = (arhiva || []).filter(a => predmet.arhivaId?.includes(a.id));
    const vidPredmetList = isDobiena
        ? (vidPredmetD || []).filter(v => predmet.vidPredmetDobienaId?.includes(v.id))
        : (vidPredmetI || []).filter(v => predmet.vidPredmetIspratenaId?.includes(v.id));

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="md" sx={{py: 2}}>

                {/* НАСЛОВ */}
                <Box sx={{
                    bgcolor: COLORS.headerBg,
                    border: `2px solid ${COLORS.borderColor}`,
                    borderRadius: '4px',
                    textAlign: 'center',
                    py: 0.8, mb: 2
                }}>
                    <Typography sx={{fontWeight: 'bold', fontSize: '1rem',
                        color: isDobiena ? '#5A3000' : '#1A4A1A'}}>
                        {isDobiena
                            ? `Деловодник на добиена пошта за ${predmet.godina} година`
                            : `Деловодник на испратена пошта за ${predmet.godina} година`
                        }
                    </Typography>
                </Box>

                <Box sx={{
                    bgcolor: COLORS.sectionBg,
                    border: `1px solid ${COLORS.borderColor}`,
                    borderRadius: '4px',
                    p: 2.5
                }}>
                    {/* СТАТУС */}
                    <Box sx={{mb: 2}}>
                        <Label color={COLORS.labelColor}>Статус на предмет</Label>
                        <Box sx={{
                            mt: 0.5, px: 1.5, py: 0.8,
                            bgcolor: '#fff',
                            border: `1px solid ${COLORS.borderColor}`,
                            borderRadius: '3px', display: 'inline-block'
                        }}>
                            <Typography sx={{fontWeight: 'bold', color: '#333'}}>
                                {predmet.statusPredmet || '—'}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* БР. НА АКТ + ДАТУМ */}
                    <Grid container spacing={2} sx={{mb: 2}}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                                <Label color={COLORS.labelColor}>Број на актот</Label>
                                {[predmet.brAkt, predmet.redenBroj, predmet.podBroj].map((val, i) => (
                                    <Box key={i} sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Box sx={{
                                            bgcolor: isDobiena ? '#C8E0FF' : '#C8F0C8',
                                            border: `1px solid ${COLORS.borderColor}`,
                                            borderRadius: '3px', px: 1.5, py: 0.3
                                        }}>
                                            <Typography sx={{fontWeight: 'bold',
                                                color: isDobiena ? '#003080' : '#003800'}}>
                                                {val}
                                            </Typography>
                                        </Box>
                                        {i < 2 && <Typography sx={{fontWeight: 'bold'}}>/</Typography>}
                                    </Box>
                                ))}
                                <Typography sx={{fontWeight: 'bold', color: '#333'}}>
                                    {predmet.godina} год.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Label color={COLORS.labelColor}>Датум на заведување</Label>
                                <Box sx={{
                                    bgcolor: '#fff',
                                    border: `1px solid ${COLORS.borderColor}`,
                                    borderRadius: '3px', px: 1.5, py: 0.5
                                }}>
                                    <Typography sx={{fontWeight: 'bold', color: '#333'}}>
                                        {predmet.datumZaveduvanje || '—'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* ТИП */}
                    <Grid container spacing={2} sx={{mb: 2}}>
                        <Grid item xs={12} sm={isDobiena ? 6 : 12}>
                            <FieldRow label="Тип на пошта" colors={COLORS}>
                                <ValueBox value={predmet.tipPosta} colors={COLORS}/>
                            </FieldRow>
                        </Grid>

                        {/* ПРИОРИТЕТ — само добиена */}
                        {isDobiena && (
                            <Grid item xs={12} sm={6}>
                                <FieldRow label="Приоритет" colors={COLORS}>
                                    <ValueBox value={predmet.prioritet} colors={COLORS}/>
                                </FieldRow>
                            </Grid>
                        )}
                    </Grid>

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* ИСПРАЌАЧ */}
                    <FieldRow label={isDobiena ? "Испраќач" : "Испратено до"} colors={COLORS}>
                        <Typography sx={{fontWeight: 'bold', color: '#333', py: 0.8}}>
                            {isprakjac?.naziv || '—'}
                        </Typography>
                    </FieldRow>

                    {/* БР. АКТ — само добиена */}
                    {isDobiena && (
                        <Grid container spacing={2} sx={{mb: 2}}>
                            <Grid item xs={12} sm={4}>
                                <Label color={COLORS.labelColor}>Број на акт (нивни)</Label>
                                <Box sx={{mt: 0.5}}>
                                    <ValueBox value={predmet.brAktNivni} colors={COLORS}/>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Label color={COLORS.labelColor}>Датум на испраќање</Label>
                                <Box sx={{mt: 0.5}}>
                                    <ValueBox value={predmet.datumIsprakjanje} colors={COLORS}/>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Label color={COLORS.labelColor}>Број на акт (архивски)</Label>
                                <Box sx={{mt: 0.5}}>
                                    <ValueBox value={predmet.brAktArhivski} colors={COLORS}/>
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* ВИД НА ПРЕДМЕТ */}
                    <Box sx={{mb: 1.5}}>
                        <Label color={COLORS.labelColor}>Вид на предмет</Label>
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5}}>
                            {vidPredmetList.length > 0
                                ? vidPredmetList.map(v => (
                                    <Chip key={v.id} label={v.naziv} size="small"
                                          sx={{bgcolor: COLORS.chipBg, fontSize: '0.75rem'}}/>
                                ))
                                : <Typography sx={{color: '#666'}}>—</Typography>
                            }
                        </Box>
                    </Box>

                    {/* СОДРЖИНА */}
                    <Box sx={{mb: 2}}>
                        <Label color={COLORS.labelColor}>Содржина</Label>
                        <Box sx={{
                            mt: 0.5, bgcolor: '#fff',
                            border: `1px solid ${COLORS.borderColor}`,
                            borderRadius: '3px', px: 1.5, py: 1, minHeight: 80
                        }}>
                            <Typography sx={{fontSize: '0.9rem', whiteSpace: 'pre-wrap'}}>
                                {predmet.sodrzina || '—'}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* ОДГОВОРНО ЛИЦЕ */}
                    <Box sx={{mb: 1.5}}>
                        <Label color={COLORS.labelColor}>Одговорно лице</Label>
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5}}>
                            {odgovornoLiceList.length > 0
                                ? odgovornoLiceList.map(u => (
                                    <Chip key={u.id}
                                          label={`${u.ime} ${u.prezime}`}
                                          size="small"
                                          sx={{bgcolor: COLORS.chipBg, fontSize: '0.75rem'}}/>
                                ))
                                : <Typography sx={{color: '#666'}}>—</Typography>
                            }
                        </Box>
                    </Box>

                    {/* ИНФОРМАТИВНА ПОШТА */}
                    <FieldRow label="Информативна пошта" colors={COLORS}>
                        <Typography sx={{
                            fontWeight: 'bold',
                            color: predmet.informativnaPosta ? COLORS.buttonBg : '#333'
                        }}>
                            {predmet.informativnaPosta ? 'Да' : 'Не'}
                        </Typography>
                    </FieldRow>

                    {/* РЕАЛИЗИРАНО */}
                    <FieldRow label="Реализирано" colors={COLORS}>
                        <Typography sx={{
                            fontWeight: 'bold',
                            color: predmet.realizirano ? COLORS.buttonBg : '#333'
                        }}>
                            {predmet.realizirano ? 'Да' : 'Не'}
                        </Typography>
                    </FieldRow>

                    {/* АРХИВА */}
                    <Box sx={{mb: 1.5}}>
                        <Label color={COLORS.labelColor}>Архива</Label>
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5}}>
                            {arhivaList.length > 0
                                ? arhivaList.map(a => (
                                    <Chip key={a.id} label={a.naziv} size="small"
                                          sx={{bgcolor: COLORS.chipBg, fontSize: '0.75rem'}}/>
                                ))
                                : <Typography sx={{color: '#666'}}>—</Typography>
                            }
                        </Box>
                    </Box>

                    {/* ЗАБЕЛЕШКА */}
                    <Box sx={{mb: 2}}>
                        <Label color={COLORS.labelColor}>Забелешка</Label>
                        <Box sx={{
                            mt: 0.5, bgcolor: '#fff',
                            border: `1px solid ${COLORS.borderColor}`,
                            borderRadius: '3px', px: 1.5, py: 1, minHeight: 60
                        }}>
                            <Typography sx={{fontSize: '0.9rem', whiteSpace: 'pre-wrap'}}>
                                {predmet.zabeleska || '—'}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* КОПЧИЊА */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <ActionButton colors={COLORS}>
                                Одговор{<br/>}испратена пошта
                            </ActionButton>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <ActionButton colors={COLORS}>
                                СД одговор{<br/>}испратена пошта
                            </ActionButton>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <ActionButton colors={COLORS}>
                                Одговор{<br/>}добиена пошта
                            </ActionButton>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </LocalizationProvider>
    );
};

export default PostaDetails;