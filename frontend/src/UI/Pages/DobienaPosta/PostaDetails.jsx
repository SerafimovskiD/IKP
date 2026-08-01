import {useState, useEffect} from 'react';
import {
    Box, Container, Typography,
    Button, Chip, CircularProgress
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import ReplyIcon from '@mui/icons-material/Reply';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InboxIcon from '@mui/icons-material/Inbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import {useNavigate, useParams} from "react-router-dom";
import usePredmetDetails from "../../../hooks/usePredmetiDetails.js";
import useIsprakjac from "../../../hooks/useIsprakjac.js";
import useArhiva from "../../../hooks/useArhiva.js";
import useVidPredmetDobieno from "../../../hooks/useVidPredmetDobieno.js";
import useVidPredmetIspratena from "../../../hooks/useVidPredmetIspratena.js";
import useUsersOdgovornoLice from "../../../hooks/useUsersOdgovornoLice.js";
import {useAuth} from "../../../context/AuthContext.jsx";
import useOrgEdinica from "../../../hooks/useOrgEdinica.js";
import usePredmeti from "../../../hooks/usePredmeti.js";
import {formatStatus} from "../../../utils/formatters.js";

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

const Section = ({title, children, theme}) => (
    <Box sx={{
        border: '1px solid #E8E8E8',
        borderRadius: '8px',
        overflow: 'hidden',
        mb: 1.5,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
        <Box sx={{background: theme.gradient, px: 2, py: 0.6}}>
            <Typography sx={{
                color: '#fff', fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase'
            }}>
                {title}
            </Typography>
        </Box>
        <Box sx={{p: 1.5, bgcolor: theme.sectionBg}}>
            {children}
        </Box>
    </Box>
);

const Field = ({label, value, theme, children}) => (
    <Box>
        <Typography sx={{
            fontSize: '0.62rem', color: '#999', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.3
        }}>
            {label}
        </Typography>
        {children || (
            <Box sx={{
                bgcolor: theme.valueBg,
                border: '1px solid #E8E8E8',
                borderRadius: '6px',
                px: 1.2, py: 0.6,
                minHeight: 32,
                display: 'flex', alignItems: 'center'
            }}>
                <Typography sx={{fontSize: '0.82rem', color: value ? '#222' : '#BBB'}}>
                    {value || '—'}
                </Typography>
            </Box>
        )}
    </Box>
);

const BoolBadge = ({value, theme}) => (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
        {value
            ? <CheckCircleIcon sx={{fontSize: 16, color: theme.accent}}/>
            : <CancelIcon sx={{fontSize: 16, color: '#CCC'}}/>
        }
        <Typography sx={{
            fontSize: '0.8rem', fontWeight: 600,
            color: value ? theme.accentDark : '#AAA'
        }}>
            {value ? 'Да' : 'Не'}
        </Typography>
    </Box>
);

const ChipList = ({items, getLabel, theme}) => (
    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
        {items.length > 0
            ? items.map((item, i) => (
                <Chip key={i} label={getLabel(item)} size="small"
                      sx={{
                          bgcolor: theme.chipBg, color: theme.chipColor,
                          fontSize: '0.7rem', fontWeight: 500, height: 22
                      }}
                />
            ))
            : <Typography sx={{fontSize: '0.82rem', color: '#BBB'}}>—</Typography>
        }
    </Box>
);

const Row = ({children, gap = 1.5}) => (
    <Box sx={{display: 'flex', gap, flexWrap: 'wrap', alignItems: 'flex-start'}}>
        {children}
    </Box>
);

const Col = ({children, flex = 1, minWidth = 180}) => (
    <Box sx={{flex, minWidth}}>
        {children}
    </Box>
);

const StatusColor = (status) => {
    if (status?.includes('архив')) return {bg: '#388E3C18', color: '#388E3C'};
    if (status?.includes('потпиш')) return {bg: '#1565C018', color: '#1565C0'};
    if (status?.includes('чека')) return {bg: '#E6510018', color: '#E65100'};
    return {bg: '#66666618', color: '#666'};
};

const PostaDetails = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    // ── СЕ HOOKS ПРВО ──
    const {predmet, loading, error} = usePredmetDetails(id);
    const {isprakjaci} = useIsprakjac();
    const {arhiva} = useArhiva();
    const {vidPredmetD} = useVidPredmetDobieno();
    const {vidPredmetI} = useVidPredmetIspratena();
    const {odgovornoLice} = useUsersOdgovornoLice();
    const {user} = useAuth();
    const {getOrgEdinicaById} = useOrgEdinica();
    const {getPrethodniPredmeti} = usePredmeti();

    const [orgEdinica, setOrgEdinica] = useState(null);
    const [prethodni, setPrethodni] = useState([]);
    const [loadingPrethodni, setLoadingPrethodni] = useState(false);

    const handleOdgovor = (tipOdgovor, tipDelovnik) => {
        const params = new URLSearchParams({
            tipDelovnik,
            tipOdgovor,
            roditelId: predmet.id,
        });
        navigate(`/createPosta/nova?${params.toString()}`);
    };

    useEffect(() => {
        if (user?.organizaciskaEdinicaId) {
            getOrgEdinicaById(user.organizaciskaEdinicaId).then(setOrgEdinica);
        }
    }, [user?.organizaciskaEdinicaId]);

    useEffect(() => {
        if (predmet?.redenBroj && predmet?.godina) {
            setLoadingPrethodni(true);
            getPrethodniPredmeti(predmet.redenBroj, predmet.godina)
                .then(res => setPrethodni(res || []))
                .finally(() => setLoadingPrethodni(false));
        }
    }, [predmet?.redenBroj, predmet?.godina]);

    // ── УСЛОВНИ RETURNS ПОСЛЕ HOOKS ──
    if (loading) return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '60vh', gap: 2
        }}>
            <CircularProgress size={36}/>
            <Typography sx={{color: '#888', fontSize: '0.82rem'}}>Се вчитуваат податоците...</Typography>
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
            <Box sx={{bgcolor: '#F2F4F7', minHeight: '100vh', py: 1.5}}>
                <Container maxWidth="xl">

                    {/* HEADER */}
                    <Box sx={{
                        background: T.gradient,
                        borderRadius: '10px 10px 0 0',
                        px: 3, py: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <Box>
                            <Typography sx={{
                                color: 'rgba(255,255,255,0.65)', fontSize: '0.62rem',
                                fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.2
                            }}>
                                {isDobiena ? 'Добиена пошта' : 'Испратена пошта'}
                            </Typography>
                            <Typography sx={{color: '#fff', fontWeight: 700, fontSize: '1rem'}}>
                                Детали на предмет
                            </Typography>
                        </Box>
                        <Box sx={{
                            bgcolor: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px', px: 2, py: 0.6,
                        }}>
                            <Typography sx={{
                                color: 'rgba(255,255,255,0.6)', fontSize: '0.58rem',
                                fontWeight: 600, letterSpacing: '0.1em', mb: 0.1
                            }}>
                                БРОЈ НА АКТ
                            </Typography>
                            <Typography
                                sx={{color: '#fff', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em'}}>
                                {predmet.brAkt} / {predmet.redenBroj} / {predmet.podBroj} / {predmet.godina}
                            </Typography>
                        </Box>
                    </Box>

                    {/* CONTENT */}
                    <Box sx={{
                        border: '1px solid #E0E3E8',
                        borderTop: 'none',
                        borderRadius: '0 0 10px 10px',
                        bgcolor: '#F8F9FB',
                        p: 1.5
                    }}>

                        {/* РЕГИСТРАЦИЈА */}
                        <Section title="Регистрација" theme={T}>
                            <Row>
                                <Col flex={2} minWidth={220}>
                                    <Field label="Статус на предмет" theme={T}>
                                        <Box sx={{
                                            bgcolor: T.chipBg,
                                            border: `1px solid ${T.border}`,
                                            borderRadius: '6px', px: 1.2, py: 0.5,
                                            display: 'inline-flex', alignItems: 'center', gap: 0.5
                                        }}>
                                            <Box sx={{width: 5, height: 5, borderRadius: '50%', bgcolor: T.accent}}/>
                                            <Typography sx={{fontSize: '0.8rem', fontWeight: 600, color: T.accentDark}}>
                                                {formatStatus(predmet.statusPredmet) || '—'}
                                            </Typography>
                                        </Box>
                                    </Field>
                                </Col>
                                <Col flex={1} minWidth={140}>
                                    <Field label="Датум на заведување" value={predmet.datumZaveduvanje} theme={T}/>
                                </Col>
                                <Col flex={1} minWidth={100}>
                                    <Field label="Тип" value={predmet.tipPosta} theme={T}/>
                                </Col>
                                {isDobiena && (
                                    <Col flex={1} minWidth={100}>
                                        <Field label="Приоритет" theme={T}>
                                            <Box sx={{
                                                bgcolor: predmet.prioritet === 'Висок' ? '#FFF3E0' : T.valueBg,
                                                border: `1px solid ${predmet.prioritet === 'Висок' ? '#FFB300' : '#E8E8E8'}`,
                                                borderRadius: '6px', px: 1.2, py: 0.6,
                                                minHeight: 32, display: 'flex', alignItems: 'center'
                                            }}>
                                                <Typography sx={{
                                                    fontSize: '0.82rem', fontWeight: 600,
                                                    color: predmet.prioritet === 'Висок' ? '#E65100' : '#222'
                                                }}>
                                                    {predmet.prioritet || '—'}
                                                </Typography>
                                            </Box>
                                        </Field>
                                    </Col>
                                )}
                            </Row>
                        </Section>

                        {/* ИСПРАЌАЧ */}
                        <Section title={isDobiena ? "Испраќач" : "Испратено до"} theme={T}>
                            <Row>
                                <Col flex={isDobiena ? 2 : 4} minWidth={220}>
                                    <Field label={isDobiena ? "Испраќач" : "Примач"} theme={T}>
                                        <Box sx={{
                                            bgcolor: T.valueBg,
                                            border: '1px solid #E8E8E8',
                                            borderRadius: '6px', px: 1.2, py: 0.6,
                                            minHeight: 32, display: 'flex', alignItems: 'center', gap: 0.5
                                        }}>
                                            {isprakjac && (
                                                <CheckCircleIcon sx={{fontSize: 13, color: T.accent, flexShrink: 0}}/>
                                            )}
                                            <Typography sx={{
                                                fontSize: '0.82rem',
                                                color: isprakjac ? '#222' : '#BBB',
                                                fontWeight: isprakjac ? 500 : 400
                                            }}>
                                                {isprakjac?.naziv || '—'}
                                            </Typography>
                                        </Box>
                                    </Field>
                                </Col>
                                {isDobiena && (
                                    <>
                                        <Col flex={1} minWidth={140}>
                                            <Field label="Број на акт (нивни)" value={predmet.brAktNivni} theme={T}/>
                                        </Col>
                                        <Col flex={1} minWidth={140}>
                                            <Field label="Број на акт (архивски)" value={predmet.brAktArhivski}
                                                   theme={T}/>
                                        </Col>
                                        <Col flex={1} minWidth={140}>
                                            <Field label="Датум на испраќање" value={predmet.datumIsprakjanje}
                                                   theme={T}/>
                                        </Col>
                                    </>
                                )}
                            </Row>
                        </Section>

                        {/* ПРЕДМЕТ */}
                        <Section title="Предмет" theme={T}>
                            <Row>
                                <Col flex={1} minWidth={180}>
                                    <Field label="Вид на предмет" theme={T}>
                                        <Box sx={{
                                            bgcolor: T.valueBg, border: '1px solid #E8E8E8',
                                            borderRadius: '6px', px: 1.2, py: 0.6, minHeight: 32
                                        }}>
                                            <ChipList items={vidPredmetList} getLabel={(v) => v.naziv} theme={T}/>
                                        </Box>
                                    </Field>
                                </Col>
                                <Col flex={2} minWidth={280}>
                                    <Field label="Содржина" theme={T}>
                                        <Box sx={{
                                            bgcolor: T.valueBg, border: '1px solid #E8E8E8',
                                            borderRadius: '6px', px: 1.2, py: 1, minHeight: 80
                                        }}>
                                            <Typography sx={{
                                                fontSize: '0.82rem',
                                                color: predmet.sodrzina ? '#222' : '#BBB',
                                                whiteSpace: 'pre-wrap', lineHeight: 1.6
                                            }}>
                                                {predmet.sodrzina || '—'}
                                            </Typography>
                                        </Box>
                                    </Field>
                                </Col>
                            </Row>
                        </Section>

                        {/* ДОДЕЛУВАЊЕ + ДОПОЛНИТЕЛНИ */}
                        <Row gap={1.5}>
                            <Col flex={7} minWidth={280}>
                                <Section title="Доделување" theme={T}>
                                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                                        <Field label="Одговорно лице" theme={T}>
                                            <Box sx={{
                                                bgcolor: T.valueBg, border: '1px solid #E8E8E8',
                                                borderRadius: '6px', px: 1.2, py: 0.6, minHeight: 32
                                            }}>
                                                <ChipList items={odgovornoLiceList}
                                                          getLabel={(u) => `${u.ime} ${u.prezime}`} theme={T}/>
                                            </Box>
                                        </Field>
                                        <Field label="Архива" theme={T}>
                                            <Box sx={{
                                                bgcolor: T.valueBg, border: '1px solid #E8E8E8',
                                                borderRadius: '6px', px: 1.2, py: 0.6, minHeight: 32
                                            }}>
                                                <ChipList items={arhivaList} getLabel={(a) => a.naziv} theme={T}/>
                                            </Box>
                                        </Field>
                                    </Box>
                                </Section>
                            </Col>

                            <Col flex={5} minWidth={220}>
                                <Section title="Дополнителни" theme={T}>
                                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                        {[
                                            {label: 'Информативна пошта', value: predmet.informativnaPosta},
                                            {label: 'Реализирано', value: predmet.realizirano},
                                        ].map(({label, value}) => (
                                            <Box key={label} sx={{
                                                border: `1px solid ${value ? T.border : '#E8E8E8'}`,
                                                borderRadius: '8px', px: 1.5, py: 0.8,
                                                display: 'flex', alignItems: 'center',
                                                justifyContent: 'space-between',
                                                bgcolor: value ? T.chipBg : '#fff'
                                            }}>
                                                <Box>
                                                    <Typography sx={{
                                                        fontSize: '0.68rem', fontWeight: 600,
                                                        color: value ? T.accentDark : '#888',
                                                        letterSpacing: '0.06em', textTransform: 'uppercase'
                                                    }}>
                                                        {label}
                                                    </Typography>
                                                    <Typography sx={{
                                                        fontSize: '0.65rem', mt: 0.1,
                                                        color: value ? T.accent : '#BBB'
                                                    }}>
                                                        {value ? 'Да' : 'Не'}
                                                    </Typography>
                                                </Box>
                                                <BoolBadge value={value} theme={T}/>
                                            </Box>
                                        ))}
                                    </Box>
                                </Section>
                            </Col>
                        </Row>

                        {/* ЗАБЕЛЕШКА */}
                        <Section title="Забелешка" theme={T}>
                            <Box sx={{
                                bgcolor: T.valueBg, border: '1px solid #E8E8E8',
                                borderRadius: '6px', px: 1.2, py: 1, minHeight: 50
                            }}>
                                <Typography sx={{
                                    fontSize: '0.82rem',
                                    color: predmet.zabeleska ? '#222' : '#BBB',
                                    whiteSpace: 'pre-wrap', lineHeight: 1.6
                                }}>
                                    {predmet.zabeleska || '—'}
                                </Typography>
                            </Box>
                        </Section>

                        {/* ИСТОРИЈА */}
                        {(loadingPrethodni || prethodni.length > 0) && (
                            <Section title="Историја на предмет" theme={T}>
                                {loadingPrethodni ? (
                                    <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}>
                                        <CircularProgress size={24} sx={{color: T.accent}}/>
                                    </Box>
                                ) : (
                                    <Box sx={{overflowX: 'auto'}}>
                                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                                            <thead>
                                            <tr>
                                                {['Под број', 'Вид пошта', 'Тип пошта', 'Датум',
                                                    'Бр. акт (нивни)', 'Испраќач', 'Одговорно лице',
                                                    'Предмет', 'Содржина', 'Реализ.',
                                                    'Архива', 'Забелешка', 'Статус'
                                                ].map(h => (
                                                    <th key={h} style={{
                                                        padding: '5px 8px', textAlign: 'left',
                                                        fontSize: '0.6rem', fontWeight: 700,
                                                        color: '#888', letterSpacing: '0.08em',
                                                        textTransform: 'uppercase',
                                                        borderBottom: '2px solid #E8E8E8',
                                                        whiteSpace: 'nowrap', background: '#F5F6FA'
                                                    }}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {prethodni.map((p) => {
                                                const isActive = p.id === Number(id);
                                                const sc = StatusColor(p.statusPredmet);
                                                return (
                                                    <tr key={p.id}
                                                        onClick={() => navigate(`/posta/${p.id}`)}
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor: isActive ? T.chipBg : 'transparent',
                                                            borderBottom: '1px solid #F0F0F0'
                                                        }}
                                                        onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = '#F8F9FB')}
                                                        onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
                                                    >
                                                        <td style={{
                                                            padding: '4px 8px', fontWeight: isActive ? 700 : 500,
                                                            color: T.accentDark, whiteSpace: 'nowrap'
                                                        }}>
                                                            {p.podBroj}
                                                        </td>
                                                        <td style={{padding: '4px 8px'}}>
                                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.3}}>
                                                                {p.tipDelovnik === 'Dobiena'
                                                                    ? <InboxIcon sx={{fontSize: 11, color: '#C8A84B'}}/>
                                                                    :
                                                                    <OutboxIcon sx={{fontSize: 11, color: '#388E3C'}}/>
                                                                }
                                                                <span style={{
                                                                    fontSize: '0.68rem',
                                                                    color: p.tipDelovnik === 'Dobiena' ? '#8B6914' : '#1B5E20',
                                                                    fontWeight: 600
                                                                }}>
                                                                        {p.tipDelovnik === 'Dobiena' ? 'ДП' : 'ИП'}
                                                                    </span>
                                                            </Box>
                                                        </td>
                                                        <td style={{
                                                            padding: '4px 8px',
                                                            fontSize: '0.75rem',
                                                            color: '#666'
                                                        }}>
                                                            {p.tipPosta}
                                                        </td>
                                                        <td style={{
                                                            padding: '4px 8px',
                                                            fontSize: '0.75rem',
                                                            color: '#666',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {p.datumZaveduvanje}
                                                        </td>
                                                        <td style={{
                                                            padding: '4px 8px',
                                                            fontSize: '0.75rem',
                                                            color: '#666'
                                                        }}>
                                                            {p.brAktNivni || '—'}
                                                        </td>
                                                        <td style={{
                                                            padding: '4px 8px',
                                                            fontSize: '0.75rem',
                                                            color: '#444',
                                                            maxWidth: 130,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {p.isprakjacNaziv || '—'}
                                                        </td>
                                                        <td style={{
                                                            padding: '4px 8px',
                                                            fontSize: '0.75rem',
                                                            color: '#444',
                                                            maxWidth: 130,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {p.odgovornoLiceNaziv?.join(', ') || '—'}
                                                        </td>
                                                        <td style={{
                                                            padding: '4px 8px',
                                                            fontSize: '0.75rem',
                                                            color: '#444',
                                                            maxWidth: 110,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {p.vidPredmetNaziv?.join('/') || '—'}
                                                        </td>
                                                        <td style={{
                                                            padding: '4px 8px',
                                                            fontSize: '0.75rem',
                                                            color: '#444',
                                                            maxWidth: 160,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {p.sodrzina || '—'}
                                                        </td>
                                                        <td style={{padding: '4px 8px'}}>
                                                            <Box sx={{
                                                                width: 7,
                                                                height: 7,
                                                                borderRadius: '50%',
                                                                bgcolor: p.realizirano ? '#4CAF50' : '#E0E0E0',
                                                                mx: 'auto'
                                                            }}/>
                                                        </td>
                                                        <td style={{
                                                            padding: '4px 8px',
                                                            fontSize: '0.75rem',
                                                            color: '#444',
                                                            maxWidth: 110,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {p.arhivaNaziv?.join(', ') || '—'}
                                                        </td>
                                                        <td style={{
                                                            padding: '4px 8px',
                                                            fontSize: '0.75rem',
                                                            color: '#444',
                                                            maxWidth: 110,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {p.zabeleska || '—'}
                                                        </td>
                                                        <td style={{padding: '4px 8px'}}>
                                                            <Chip label={formatStatus(p.statusPredmet) || '—'} size="small"
                                                                  sx={{
                                                                      bgcolor: sc.bg, color: sc.color,
                                                                      fontSize: '0.6rem', fontWeight: 600, height: 18
                                                                  }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </Box>
                                )}
                            </Section>
                        )}

                        {/* КОПЧИЊА */}
                        {predmet.isActive && (
                            <Box sx={{
                                display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center',
                                pt: 1.5, borderTop: '1px solid #E8E8E8', mt: 0.5
                            }}>
                                {[
                                    {label: 'Одговор добиена', tipOdgovor: 'DP_odgovor', tipDelovnik: 'Dobiena'},
                                    {label: 'СД одговор', tipOdgovor: 'SD_odgovor', tipDelovnik: 'Dobiena'},
                                    {label: 'Одговор испратена', tipOdgovor: 'IP_odgovor', tipDelovnik: 'Ispratena'},
                                ].map(({label, tipOdgovor, tipDelovnik}) => (
                                    <Button key={label}
                                            variant="outlined"
                                            startIcon={<ReplyIcon sx={{fontSize: 14}}/>}
                                            onClick={() => handleOdgovor(tipOdgovor, tipDelovnik)}
                                            sx={{
                                                borderColor: '#D8D8D8', color: '#666',
                                                fontWeight: 500, fontSize: '0.75rem',
                                                textTransform: 'none', px: 1.5, py: 0.7,
                                                borderRadius: '8px',
                                                '&:hover': {
                                                    borderColor: T.border,
                                                    color: T.accentDark,
                                                    bgcolor: T.chipBg
                                                }
                                            }}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Container>
            </Box>
        </LocalizationProvider>
    );
};

export default PostaDetails;