import {useState, useEffect} from 'react';
import {
    Box, Container, Typography, Grid,
    Button, Chip, CircularProgress
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ReplyIcon from '@mui/icons-material/Reply';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {useNavigate, useParams} from "react-router-dom";
import usePredmetDetails from "../../../hooks/usePredmetiDetails.js";
import useIsprakjac from "../../../hooks/useIsprakjac.js";
import useArhiva from "../../../hooks/useArhiva.js";
import useVidPredmetDobieno from "../../../hooks/useVidPredmetDobieno.js";
import useVidPredmetIspratena from "../../../hooks/useVidPredmetIspratena.js";
import useUsersOdgovornoLice from "../../../hooks/useUsersOdgovornoLice.js";
import {useAuth} from "../../../context/AuthContext.jsx";
import useOrgEdinica from "../../../hooks/useOrgEdinica.js";

const DOBIENA = {
    gradient: 'linear-gradient(135deg, #6B4F0E 0%, #C8A84B 60%, #E8D48A 100%)',
    border: '#C8A84B',
    chipBg: '#FDF3D8',
    chipColor: '#7A5C00',
    accent: '#C8A84B',
    accentDark: '#7A5C00',
    btnBg: '#8B6914',
    btnHover: '#6B4F0E',
    sectionBg: '#FFFDF5',
    labelColor: '#8B6914',
    valueBg: '#fff',
};

const ISPRATENA = {
    gradient: 'linear-gradient(135deg, #1B5E20 0%, #388E3C 60%, #81C784 100%)',
    border: '#388E3C',
    chipBg: '#E8F5E9',
    chipColor: '#1B5E20',
    accent: '#388E3C',
    accentDark: '#1B5E20',
    btnBg: '#2E7D32',
    btnHover: '#1B5E20',
    sectionBg: '#F9FDF9',
    labelColor: '#1B5E20',
    valueBg: '#fff',
};

// ─── SECTION ─────────────────────────────────────────────────────────────────
const Section = ({title, children, theme}) => (
    <Box sx={{
        border: '1px solid #E8E8E8',
        borderRadius: '8px',
        overflow: 'hidden',
        mb: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
        <Box sx={{background: theme.gradient, px: 2.5, py: 1}}>
            <Typography sx={{
                color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase'
            }}>
                {title}
            </Typography>
        </Box>
        <Box sx={{p: 2.5, bgcolor: theme.sectionBg}}>
            {children}
        </Box>
    </Box>
);

// ─── READ ONLY FIELD ─────────────────────────────────────────────────────────
const Field = ({label, value, theme, children}) => (
    <Box>
        <Typography sx={{
            fontSize: '0.65rem', color: '#999', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5
        }}>
            {label}
        </Typography>
        {children || (
            <Box sx={{
                bgcolor: theme.valueBg,
                border: '1px solid #E8E8E8',
                borderRadius: '6px',
                px: 1.5, py: 1,
                minHeight: 40,
                display: 'flex', alignItems: 'center'
            }}>
                <Typography sx={{fontSize: '0.875rem', color: value ? '#222' : '#BBB'}}>
                    {value || '—'}
                </Typography>
            </Box>
        )}
    </Box>
);

// ─── BOOLEAN BADGE ────────────────────────────────────────────────────────────
const BoolBadge = ({value, theme}) => (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.6}}>
        {value
            ? <CheckCircleIcon sx={{fontSize: 18, color: theme.accent}}/>
            : <CancelIcon sx={{fontSize: 18, color: '#CCC'}}/>
        }
        <Typography sx={{fontSize: '0.85rem', fontWeight: 600,
            color: value ? theme.accentDark : '#AAA'}}>
            {value ? 'Да' : 'Не'}
        </Typography>
    </Box>
);

// ─── CHIPS ────────────────────────────────────────────────────────────────────
const ChipList = ({items, getLabel, theme}) => (
    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.6}}>
        {items.length > 0
            ? items.map((item, i) => (
                <Chip key={i} label={getLabel(item)} size="small"
                      sx={{bgcolor: theme.chipBg, color: theme.chipColor,
                          fontSize: '0.72rem', fontWeight: 500, height: 24}}
                />
            ))
            : <Typography sx={{fontSize: '0.85rem', color: '#BBB'}}>—</Typography>
        }
    </Box>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const PostaDetails = () => {
    const {id} = useParams();
    const {predmet, loading, error} = usePredmetDetails(id);

    const navigate = useNavigate();

    const {isprakjaci} = useIsprakjac();
    const {arhiva} = useArhiva();
    const {vidPredmetD} = useVidPredmetDobieno();
    const {vidPredmetI} = useVidPredmetIspratena();
    const {odgovornoLice} = useUsersOdgovornoLice();
    const {user} = useAuth();
    const {getOrgEdinicaById} = useOrgEdinica();
    const [orgEdinica, setOrgEdinica] = useState(null);

    const handleOdgovor = (tipOdgovor,tipDelovnik) => {
        const params = new URLSearchParams({
            tipDelovnik: tipDelovnik,
            tipOdgovor: tipOdgovor,
            roditelId: predmet.id,
        });
        navigate(`/createPosta/nova?${params.toString()}`);
    };

    useEffect(() => {
        if (user?.organizaciskaEdinicaId) {
            getOrgEdinicaById(user.organizaciskaEdinicaId).then(setOrgEdinica);
        }
    }, [user?.organizaciskaEdinicaId]);

    if (loading) return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '60vh', gap: 2}}>
            <CircularProgress size={40}/>
            <Typography sx={{color: '#888', fontSize: '0.85rem'}}>Се вчитуваат податоците...</Typography>
        </Box>
    );

    if (error) return (
        <Box sx={{p: 3, textAlign: 'center'}}>
            <Typography color="error">{error}</Typography>
        </Box>
    );

    if (!predmet) return null;

    const isDobiena = predmet.tipDelovnik === "Dobiena";
    const T = isDobiena ? DOBIENA : ISPRATENA;

    const isprakjac = isprakjaci?.find(i => i.id === predmet.isprakjacId);
    const odgovornoLiceList = (odgovornoLice || []).filter(u => predmet.odgovornoLiceId?.includes(u.id));
    const arhivaList = (arhiva || []).filter(a => predmet.arhivaId?.includes(a.id));
    const vidPredmetList = isDobiena
        ? (vidPredmetD || []).filter(v => predmet.vidPredmetDobienaId?.includes(v.id))
        : (vidPredmetI || []).filter(v => predmet.vidPredmetIspratenaId?.includes(v.id));

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{bgcolor: '#F2F4F7', minHeight: '100vh', py: 2.5}}>
                <Container maxWidth="xl">

                    {/* ── HEADER ── */}
                    <Box sx={{
                        background: T.gradient,
                        borderRadius: '10px 10px 0 0',
                        px: 3, py: 1.5,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <Box>
                            <Typography sx={{color: 'rgba(255,255,255,0.65)', fontSize: '0.62rem',
                                fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.2}}>
                                {isDobiena ? 'Добиена пошта' : 'Испратена пошта'}
                            </Typography>
                            <Typography sx={{color: '#fff', fontWeight: 700, fontSize: '1rem'}}>
                                Детали на предмет
                            </Typography>
                        </Box>
                        <Box sx={{
                            bgcolor: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px', px: 2, py: 0.8,
                        }}>
                            <Typography sx={{color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem',
                                fontWeight: 600, letterSpacing: '0.1em', mb: 0.2}}>
                                БРОЈ НА АКТ
                            </Typography>
                            <Typography sx={{color: '#fff', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.06em'}}>
                                {predmet.brAkt} / {predmet.redenBroj} / {predmet.podBroj} / {predmet.godina}
                            </Typography>
                        </Box>
                    </Box>

                    {/* ── CONTENT ── */}
                    <Box sx={{
                        border: '1px solid #E0E3E8',
                        borderTop: 'none',
                        borderRadius: '0 0 10px 10px',
                        bgcolor: '#F8F9FB',
                        p: 2.5
                    }}>

                        {/* ── РЕГИСТРАЦИЈА ── */}
                        <Section title="Регистрација" theme={T}>
                            <Grid container spacing={2.5} alignItems="flex-start">
                                <Grid item xs={12} md={5}>
                                    <Field label="Статус на предмет" theme={T}>
                                        <Box sx={{
                                            bgcolor: T.chipBg,
                                            border: `1px solid ${T.border}`,
                                            borderRadius: '6px', px: 1.5, py: 0.8,
                                            display: 'inline-flex', alignItems: 'center', gap: 0.6
                                        }}>
                                            <Box sx={{width: 6, height: 6, borderRadius: '50%', bgcolor: T.accent}}/>
                                            <Typography sx={{fontSize: '0.85rem', fontWeight: 600, color: T.accentDark}}>
                                                {predmet.statusPredmet || '—'}
                                            </Typography>
                                        </Box>
                                    </Field>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Field label="Датум на заведување" value={predmet.datumZaveduvanje} theme={T}/>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <Field label="Тип" value={predmet.tipPosta} theme={T}/>
                                </Grid>
                                {isDobiena && (
                                    <Grid item xs={12} sm={6} md={2}>
                                        <Field label="Приоритет" theme={T}>
                                            <Box sx={{
                                                bgcolor: predmet.prioritet === 'Висок' ? '#FFF3E0' : T.valueBg,
                                                border: `1px solid ${predmet.prioritet === 'Висок' ? '#FFB300' : '#E8E8E8'}`,
                                                borderRadius: '6px', px: 1.5, py: 1,
                                                minHeight: 40, display: 'flex', alignItems: 'center'
                                            }}>
                                                <Typography sx={{
                                                    fontSize: '0.875rem', fontWeight: 600,
                                                    color: predmet.prioritet === 'Висок' ? '#E65100' : '#222'
                                                }}>
                                                    {predmet.prioritet || '—'}
                                                </Typography>
                                            </Box>
                                        </Field>
                                    </Grid>
                                )}
                            </Grid>
                        </Section>

                        {/* ── ИСПРАЌАЧ ── */}
                        <Section title={isDobiena ? "Испраќач" : "Испратено до"} theme={T}>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12} md={isDobiena ? 5 : 12}>
                                    <Field label={isDobiena ? "Испраќач" : "Примач"} theme={T}>
                                        <Box sx={{
                                            bgcolor: T.valueBg,
                                            border: '1px solid #E8E8E8',
                                            borderRadius: '6px', px: 1.5, py: 1,
                                            minHeight: 40, display: 'flex', alignItems: 'center', gap: 0.6
                                        }}>
                                            {isprakjac && (
                                                <CheckCircleIcon sx={{fontSize: 14, color: T.accent, flexShrink: 0}}/>
                                            )}
                                            <Typography sx={{fontSize: '0.875rem', color: isprakjac ? '#222' : '#BBB', fontWeight: isprakjac ? 500 : 400}}>
                                                {isprakjac?.naziv || '—'}
                                            </Typography>
                                        </Box>
                                    </Field>
                                </Grid>

                                {isDobiena && (
                                    <>
                                        <Grid item xs={12} sm={6} md={3.5}>
                                            <Field label="Број на акт (нивни)" value={predmet.brAktNivni} theme={T}/>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3.5}>
                                            <Field label="Број на акт (архивски)" value={predmet.brAktArhivski} theme={T}/>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Field label="Датум на испраќање" value={predmet.datumIsprakjanje} theme={T}/>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Section>

                        {/* ── ПРЕДМЕТ ── */}
                        <Section title="Предмет" theme={T}>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12} md={4}>
                                    <Field label="Вид на предмет" theme={T}>
                                        <Box sx={{
                                            bgcolor: T.valueBg,
                                            border: '1px solid #E8E8E8',
                                            borderRadius: '6px', px: 1.5, py: 1, minHeight: 40
                                        }}>
                                            <ChipList items={vidPredmetList} getLabel={(v) => v.naziv} theme={T}/>
                                        </Box>
                                    </Field>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Field label="Содржина" theme={T}>
                                        <Box sx={{
                                            bgcolor: T.valueBg,
                                            border: '1px solid #E8E8E8',
                                            borderRadius: '6px', px: 1.5, py: 1.2,
                                            minHeight: 120
                                        }}>
                                            <Typography sx={{fontSize: '0.875rem', color: predmet.sodrzina ? '#222' : '#BBB',
                                                whiteSpace: 'pre-wrap', lineHeight: 1.6}}>
                                                {predmet.sodrzina || '—'}
                                            </Typography>
                                        </Box>
                                    </Field>
                                </Grid>
                            </Grid>
                        </Section>

                        {/* ── ДОДЕЛУВАЊЕ + ДОПОЛНИТЕЛНИ ── */}
                        <Grid container spacing={2} sx={{mb: 2}}>
                            <Grid item xs={12} md={7}>
                                <Section title="Доделување" theme={T}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Field label="Одговорно лице" theme={T}>
                                                <Box sx={{
                                                    bgcolor: T.valueBg,
                                                    border: '1px solid #E8E8E8',
                                                    borderRadius: '6px', px: 1.5, py: 1, minHeight: 40
                                                }}>
                                                    <ChipList
                                                        items={odgovornoLiceList}
                                                        getLabel={(u) => `${u.ime} ${u.prezime}`}
                                                        theme={T}
                                                    />
                                                </Box>
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field label="Архива" theme={T}>
                                                <Box sx={{
                                                    bgcolor: T.valueBg,
                                                    border: '1px solid #E8E8E8',
                                                    borderRadius: '6px', px: 1.5, py: 1, minHeight: 40
                                                }}>
                                                    <ChipList
                                                        items={arhivaList}
                                                        getLabel={(a) => a.naziv}
                                                        theme={T}
                                                    />
                                                </Box>
                                            </Field>
                                        </Grid>
                                    </Grid>
                                </Section>
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <Section title="Дополнителни" theme={T}>
                                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                                        <Box sx={{
                                            border: `1px solid ${predmet.informativnaPosta ? T.border : '#E8E8E8'}`,
                                            borderRadius: '8px', px: 2, py: 1.2,
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            bgcolor: predmet.informativnaPosta ? T.chipBg : '#fff'
                                        }}>
                                            <Box>
                                                <Typography sx={{fontSize: '0.72rem', fontWeight: 600,
                                                    color: predmet.informativnaPosta ? T.accentDark : '#888',
                                                    letterSpacing: '0.06em', textTransform: 'uppercase'}}>
                                                    Информативна пошта
                                                </Typography>
                                                <Typography sx={{fontSize: '0.68rem', mt: 0.2,
                                                    color: predmet.informativnaPosta ? T.accent : '#BBB'}}>
                                                    {predmet.informativnaPosta ? 'Да' : 'Не'}
                                                </Typography>
                                            </Box>
                                            <BoolBadge value={predmet.informativnaPosta} theme={T}/>
                                        </Box>

                                        <Box sx={{
                                            border: `1px solid ${predmet.realizirano ? T.border : '#E8E8E8'}`,
                                            borderRadius: '8px', px: 2, py: 1.2,
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            bgcolor: predmet.realizirano ? T.chipBg : '#fff'
                                        }}>
                                            <Box>
                                                <Typography sx={{fontSize: '0.72rem', fontWeight: 600,
                                                    color: predmet.realizirano ? T.accentDark : '#888',
                                                    letterSpacing: '0.06em', textTransform: 'uppercase'}}>
                                                    Реализирано
                                                </Typography>
                                                <Typography sx={{fontSize: '0.68rem', mt: 0.2,
                                                    color: predmet.realizirano ? T.accent : '#BBB'}}>
                                                    {predmet.realizirano ? 'Да' : 'Не'}
                                                </Typography>
                                            </Box>
                                            <BoolBadge value={predmet.realizirano} theme={T}/>
                                        </Box>
                                    </Box>
                                </Section>
                            </Grid>
                        </Grid>

                        {/* ── ЗАБЕЛЕШКА ── */}
                        <Section title="Забелешка" theme={T}>
                            <Box sx={{
                                bgcolor: T.valueBg,
                                border: '1px solid #E8E8E8',
                                borderRadius: '6px', px: 1.5, py: 1.2,
                                minHeight: 70
                            }}>
                                <Typography sx={{fontSize: '0.875rem', color: predmet.zabeleska ? '#222' : '#BBB',
                                    whiteSpace: 'pre-wrap', lineHeight: 1.6}}>
                                    {predmet.zabeleska || '—'}
                                </Typography>
                            </Box>
                        </Section>

                        {/* ── КОПЧИЊА ── */}
                        <Box sx={{
                            display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center',
                            pt: 2, borderTop: '1px solid #E8E8E8', mt: 1
                        }}>
                            <Box sx={{width: '1px', height: 28, bgcolor: '#E0E0E0', mx: 0.5}}/>

                            {[
                                {label: 'Одговор добиена', tipOdgovor: 'DP_odgovor',tipDelovnik:'Dobiena'},
                                {label: 'СД одговор', tipOdgovor: 'SD_odgovor',tipDelovnik:'Dobiena'},
                                {label: 'Одговор испратена', tipOdgovor: 'IP_odgovor',tipDelovnik:'Ispratena'},
                            ].map(({label, tipOdgovor,tipDelovnik}) => (
                                <Button key={label}
                                        variant="outlined"
                                        startIcon={<ReplyIcon sx={{fontSize: 15}}/>}
                                        onClick={() => handleOdgovor(tipOdgovor,tipDelovnik)}
                                        sx={{
                                            borderColor: '#D8D8D8', color: '#666',
                                            fontWeight: 500, fontSize: '0.78rem',
                                            textTransform: 'none', px: 2, py: 0.9,
                                            borderRadius: '8px',
                                            '&:hover': {borderColor: T.border, color: T.accentDark, bgcolor: T.chipBg}
                                        }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>

                    </Box>
                </Container>
            </Box>
        </LocalizationProvider>
    );
};

export default PostaDetails;