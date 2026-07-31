import {useState, useMemo, useRef, useEffect} from 'react';
import {
    Box, Container, Typography, Grid, TextField,
    FormControl, RadioGroup, FormControlLabel, Radio,
    Button, Chip, OutlinedInput, Select, MenuItem,
    InputLabel, InputAdornment, ListSubheader,
    CircularProgress, Switch, IconButton, Tooltip
} from '@mui/material';
import {LocalizationProvider, DatePicker, ClearIcon} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import ReplyIcon from '@mui/icons-material/Reply';
import dayjs from 'dayjs';
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEnums} from "../../../hooks/useEnums.js";
import useIsprakjac from "../../../hooks/useIsprakjac.js";
import useArhiva from "../../../hooks/useArhiva.js";
import useVidPredmetDobieno from "../../../hooks/useVidPredmetDobieno.js";
import useVidPredmetIspratena from "../../../hooks/useVidPredmetIspratena.js";
import useUsersOdgovornoLice from "../../../hooks/useUsersOdgovornoLice.js";
import {useAuth} from "../../../context/AuthContext.jsx";
import useOrgEdinica from "../../../hooks/useOrgEdinica.js";
import usePredmeti from "../../../hooks/usePredmeti.js";
import usePredmetDetails from "../../../hooks/usePredmetiDetails.js";

const DOBIENA = {
    gradient: 'linear-gradient(135deg, #6B4F0E 0%, #C8A84B 60%, #E8D48A 100%)',
    gradientLight: 'linear-gradient(135deg, #FDF8EC 0%, #FDF3D8 100%)',
    border: '#C8A84B',
    borderLight: '#E8D48A',
    chipBg: '#FDF3D8',
    chipColor: '#7A5C00',
    accent: '#C8A84B',
    accentDark: '#7A5C00',
    btnBg: '#8B6914',
    btnHover: '#6B4F0E',
    sectionBg: '#FFFDF5',
};

const ISPRATENA = {
    gradient: 'linear-gradient(135deg, #1B5E20 0%, #388E3C 60%, #81C784 100%)',
    gradientLight: 'linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 100%)',
    border: '#388E3C',
    borderLight: '#81C784',
    chipBg: '#E8F5E9',
    chipColor: '#1B5E20',
    accent: '#388E3C',
    accentDark: '#1B5E20',
    btnBg: '#2E7D32',
    btnHover: '#1B5E20',
    sectionBg: '#F9FDF9',
};

// ─── SECTION ─────────────────────────────────────────────────────────────────
const Section = ({title, children, theme, noPad = false}) => (
    <Box sx={{
        border: `1px solid #E8E8E8`,
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
        <Box sx={{p: noPad ? 0 : 2.5, bgcolor: theme.sectionBg}}>
            {children}
        </Box>
    </Box>
);

const Err = ({msg}) => (
    <Typography sx={{
        color: '#d32f2f',
        fontSize: '0.68rem',
        mt: 0.3,
        minHeight: '1rem',  // ← фиксна висина секогаш
        visibility: msg ? 'visible' : 'hidden'  // ← скриено но простор е резервиран
    }}>
        {msg || ' '}
    </Typography>
);

// ─── SINGLE SELECT ────────────────────────────────────────────────────────────
const SingleSelect = ({label, value, onChange, options, getLabel, getId, error, fullWidth, minWidth = 260, size = 'small'}) => {
    const [search, setSearch] = useState('');
    const filtered = useMemo(() => {
        if (!search) return options;
        return options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase()));
    }, [search, options, getLabel]);

    return (
        <FormControl size={size} error={!!error}
                     sx={{minWidth: '300px', maxWidth: '300px'}}>
            <InputLabel>{label}</InputLabel>
            <Select
                label={label} value={value}
                onChange={(e) => onChange(e.target.value)}
                onClose={() => setSearch('')}
                // endAdornment={<InputAdornment position="end" sx={{mr: 2}}></InputAdornment>}

                MenuProps={{
                    anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
                    transformOrigin: {vertical: 'top', horizontal: 'left'},
                    autoFocus: false,
                    slotProps: {paper: {sx: {maxHeight: 320, boxShadow: '0 4px 20px rgba(0,0,0,0.12)'}}}
                }}
            >
                <ListSubheader sx={{p: 1, bgcolor: '#fff'}}>
                    <TextField size="small" fullWidth placeholder="Пребарај..."
                               autoFocus value={search}
                               onChange={(e) => {e.stopPropagation(); setSearch(e.target.value);}}
                               onKeyDown={(e) => e.stopPropagation()}
                               InputProps={{startAdornment: <InputAdornment position="start"><SearchIcon sx={{fontSize: 14, color: '#999'}}/></InputAdornment>}}
                    />
                </ListSubheader>
                {filtered.length === 0
                    ? <MenuItem disabled><Typography variant="caption" color="text.secondary">Нема резултати</Typography></MenuItem>
                    : filtered.map(o => (
                        <MenuItem key={getId(o)} value={getId(o)} sx={{fontSize: '0.85rem', py: 0.8}}>
                            {getLabel(o)}
                        </MenuItem>
                    ))
                }
            </Select>
            <Err msg={error}/>
        </FormControl>
    );
};

// ─── MULTI SELECT ─────────────────────────────────────────────────────────────
const MultiSelect = ({label, value, onChange, options, getLabel, getId, error, theme, fullWidth, minWidth = 260}) => {
    const [search, setSearch] = useState('');
    const filtered = useMemo(() => {
        if (!search) return options;
        return options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase()));
    }, [search, options, getLabel]);

    return (
        <FormControl size="small" error={!!error}
                     sx={{minWidth: '300px', maxWidth: '300px'}}>
            <InputLabel>{label}</InputLabel>
            <Select
                multiple label={label} value={value}
                onChange={(e) => onChange(e.target.value)}
                onClose={() => setSearch('')}
                input={<OutlinedInput label={label}/>}
                // endAdornment={<InputAdornment position="end" sx={{mr: 2}}></InputAdornment>}

                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.4, py: 0.2}}>
                        {selected.map(id => {
                            const item = options.find(o => getId(o) === id);
                            return (
                                <Chip key={id} label={item ? getLabel(item) : id} size="small"
                                      sx={{bgcolor: theme?.chipBg || '#F5F5F5', color: theme?.chipColor || '#333',
                                          fontSize: '0.68rem', height: 20, fontWeight: 500}}
                                />
                            );
                        })}
                    </Box>
                )}
                MenuProps={{
                    anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
                    transformOrigin: {vertical: 'top', horizontal: 'left'},
                    autoFocus: false,
                    slotProps: {paper: {sx: {maxHeight: 320, boxShadow: '0 4px 20px rgba(0,0,0,0.12)'}}}
                }}
            >
                <ListSubheader sx={{p: 1, bgcolor: '#fff'}}>
                    <TextField size="small" fullWidth placeholder="Пребарај..."
                               autoFocus value={search}
                               onChange={(e) => {e.stopPropagation(); setSearch(e.target.value);}}
                               onKeyDown={(e) => e.stopPropagation()}
                               InputProps={{startAdornment: <InputAdornment position="start"><SearchIcon sx={{fontSize: 14, color: '#999'}}/></InputAdornment>}}
                    />
                </ListSubheader>
                <ListSubheader sx={{py: 0.5, lineHeight: '1.8', bgcolor: '#FAFAFA'}}>
                    <Typography variant="caption" color="text.secondary">
                        {filtered.length === 0 ? 'Нема резултати' : `${value.length} избрано · ${filtered.length} вкупно`}
                    </Typography>
                </ListSubheader>
                {filtered.map(o => (
                    <MenuItem key={getId(o)} value={getId(o)} sx={{fontSize: '0.85rem', py: 0.8}}>
                        {getLabel(o)}
                    </MenuItem>
                ))}
            </Select>
            <Err msg={error}/>
        </FormControl>
    );
};

// ─── SWITCH CARD ──────────────────────────────────────────────────────────────
const SwitchCard = ({label, checked, onChange, theme}) => (
    <Box sx={{
        border: `1px solid ${checked ? theme.border : '#E8E8E8'}`,
        borderRadius: '8px', px: 2, py: 1.2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        bgcolor: checked ? theme.chipBg : '#fff',
        transition: 'all 0.2s', cursor: 'pointer',
        '&:hover': {borderColor: theme.border}
    }} onClick={() => onChange(!checked)}>
        <Box>
            <Typography sx={{fontSize: '0.75rem', fontWeight: 600, color: checked ? theme.accentDark : '#666',
                letterSpacing: '0.06em', textTransform: 'uppercase'}}>
                {label}
            </Typography>
            <Typography sx={{fontSize: '0.68rem', color: checked ? theme.accent : '#999', mt: 0.2}}>
                {checked ? 'Да' : 'Не'}
            </Typography>
        </Box>
        <Switch
            checked={checked}
            onChange={(e) => {e.stopPropagation(); onChange(e.target.checked);}}
            size="small"
            sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {color: theme.accent},
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {bgcolor: theme.accent}
            }}
        />
    </Box>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const PredmetForm = () => {
    const [searchParams] = useSearchParams();
    const tipDelovnik = searchParams.get("tipDelovnik") || "Dobiena";
    const isDobiena = tipDelovnik === "Dobiena";
    const T = isDobiena ? DOBIENA : ISPRATENA;
    const today = dayjs();
    const fileInputRef = useRef(null);
    const dropRef = useRef(null);

    const [form, setForm] = useState({
        datumZaveduvanje: today,
        tipPosta: "",
        prioritet: "",
        isprakjacId: "",
        brAktNivni: "",
        datumIsprakjanje: null,
        brAktArhivski: "",
        vidPredmetDobienaId: [],
        vidPredmetIspratenaId: [],
        sodrzina: "",
        odgovornoLiceId: [],
        informativnaPosta: false,
        realizirano: false,
        arhivaId: [],
        zabeleska: "",
        statusPredmet: ""
    });
    const clear =()=>setForm({
        datumZaveduvanje: today,
        tipPosta: "",
        prioritet: "",
        isprakjacId: "",
        brAktNivni: "",
        datumIsprakjanje: null,
        brAktArhivski: "",
        vidPredmetDobienaId: [],
        vidPredmetIspratenaId: [],
        sodrzina: "",
        odgovornoLiceId: [],
        informativnaPosta: false,
        realizirano: false,
        arhivaId: [],
        zabeleska: "",
        statusPredmet: ""
    })
    const [formErrors, setFormErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const {prioritet: prioritetEnum, tipPosta: tipPostaEnum, statusPredmet: statusEnum} = useEnums();
    const {createPosta, loading, error, nextRedenBroj} = usePredmeti();
    const {isprakjaci, loading: lI} = useIsprakjac();
    const {arhiva, loading: lA} = useArhiva();
    const {vidPredmetD, loading: lVD} = useVidPredmetDobieno();
    const {vidPredmetI, loading: lVI} = useVidPredmetIspratena();
    const {odgovornoLice, loading: lO} = useUsersOdgovornoLice();
    const {user} = useAuth();
    const {getOrgEdinicaById} = useOrgEdinica();
    const [orgEdinica, setOrgEdinica] = useState(null);

    const roditelId = searchParams.get("roditelId") ? Number(searchParams.get("roditelId")) : null;
    const tipOdgovor = searchParams.get("tipOdgovor") || null;
    const isOdgovor = !!roditelId;

    const { predmet: roditel } = usePredmetDetails(roditelId);
    useEffect(() => {
        if (user?.organizaciskaEdinicaId) {
            getOrgEdinicaById(user.organizaciskaEdinicaId).then(setOrgEdinica);
        }
    }, [user?.organizaciskaEdinicaId]);

    const isPageLoading = lI || lA || lVD || lVI || lO;

    const hc = (field, value) => {
        setForm(p => ({...p, [field]: value}));
        if (submitted) setFormErrors(p => ({...p, [field]: null}));
    };

    const validate = (f = form) => {
        const e = {};
        if (!f.statusPredmet) e.statusPredmet = "Задолжително";
        if (!f.datumZaveduvanje) e.datumZaveduvanje = "Задолжително";
        if (!f.tipPosta) e.tipPosta = "Задолжително";
        if (!f.isprakjacId) e.isprakjacId = "Задолжително";
        if (!f.sodrzina?.trim()) e.sodrzina = "Задолжително";
        if (f.odgovornoLiceId.length === 0) e.odgovornoLiceId = "Задолжително";
        if (isDobiena) {
            if (!f.prioritet) e.prioritet = "Задолжително";
            if (!f.brAktNivni?.trim()) e.brAktNivni = "Задолжително";
            if (!f.datumIsprakjanje) e.datumIsprakjanje = "Задолжително";
            if (f.vidPredmetDobienaId.length === 0) e.vidPredmet = "Задолжително";
        } else {
            if (f.vidPredmetIspratenaId.length === 0) e.vidPredmet = "Задолжително";
        }
        return e;
    };

    useEffect(() => {
        if (submitted) setFormErrors(validate());
    }, [form, submitted]);
    const navigate = useNavigate()
    const handleSubmit = async () => {
        setSubmitted(true);
        const errs = validate();
        setFormErrors(errs);
        if (Object.keys(errs).length > 0) return;
        const payload = {
            datumZaveduvanje: form.datumZaveduvanje?.format('YYYY-MM-DD'),
            tipPosta: form.tipPosta,
            sodrzina: form.sodrzina,
            odgovornoLiceId: form.odgovornoLiceId,
            informativnaPosta: form.informativnaPosta,
            realizirano: form.realizirano,
            arhivaId: form.arhivaId,
            zabeleska: form.zabeleska,
            statusPredmet: form.statusPredmet || null,
            isprakjacId: Number(form.isprakjacId),
            ...(isDobiena && {
                prioritet: form.prioritet || null,
                brAktNivni: form.brAktNivni || null,
                datumIsprakjanje: form.datumIsprakjanje?.format('YYYY-MM-DD') || null,
                brAktArhivski: form.brAktArhivski || null,
                vidPredmetDobienaId: form.vidPredmetDobienaId,
            }),
            ...(!isDobiena && {vidPredmetIspratenaId: form.vidPredmetIspratenaId}),
        };
        try {
            await createPosta(
                payload,
                tipDelovnik,
                tipOdgovor,
                roditel?.redenBroj ?? null,
                roditel?.godina ?? null,
                roditel?.podBroj ?? null
            );
            alert('Успешно зачувано!');
            setSubmitted(false);
            setFormErrors({});
            navigate("/predmeti")
        } catch (e) {
            console.error(e.response?.data);
        }
    };

    // const selectedIsprakjac = isprakjaci?.find(i => i.id === form.isprakjacId);

    if (isPageLoading) return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '60vh', gap: 2}}>
            <CircularProgress sx={{color: T.accent}} size={40}/>
            <Typography sx={{color: '#888', fontSize: '0.85rem'}}>Се вчитуваат податоците...</Typography>
        </Box>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{bgcolor: '#F2F4F7', minHeight: '100vh', py: 2.5}}>
                <Container maxWidth="xl">

                    {/* ── HEADER CARD ── */}
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
                            <Typography sx={{color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em'}}>
                                Нов предмет
                            </Typography>
                        </Box>
                        <Box sx={{
                            bgcolor: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px', px: 2, py: 0.8,
                            backdropFilter: 'blur(4px)'
                        }}>

                            <Typography sx={{color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem',
                                fontWeight: 600, letterSpacing: '0.1em', mb: 0.2}}>
                                БРОЈ НА АКТ
                            </Typography>
                            <Typography sx={{color: '#fff', fontWeight: 700, fontSize: '0.95rem'}}>
                                {roditelId
                                    ? `${roditel?.brAkt ?? '···'} / ${roditel?.redenBroj ?? '···'} / ${(roditel?.podBroj ?? 0) + 1} / ${roditel?.godina ?? today.year()}`
                                    : `${orgEdinica?.code ?? '·····'} / ${nextRedenBroj ?? '···'} / 1 / ${today.year()}`
                                }
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


                        {/* ── РЕД 1: СТАТУС + ДАТУМ + ТИП ── */}
                        <Section title="Регистрација" theme={T}>
                            <Grid container spacing={2.5} alignItems="flex-start">

                                {/* Статус — поголем */}
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{fontSize: '0.68rem', color: formErrors.statusPredmet ? '#d32f2f' : '#888',
                                        fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'}}>
                                        Статус на предмет *
                                    </Typography>
                                    <SingleSelect
                                        label="Избери статус"
                                        value={form.statusPredmet}
                                        onChange={(v) => hc('statusPredmet', v)}
                                        options={statusEnum.map(s => ({id: s, naziv: s}))}
                                        getLabel={(o) => o.naziv}
                                        getId={(o) => o.id}
                                        error={formErrors.statusPredmet}
                                        fullWidth
                                        size="medium"
                                    />
                                </Grid>

                                {/* Датум */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography sx={{fontSize: '0.68rem', color: formErrors.datumZaveduvanje ? '#d32f2f' : '#888',
                                        fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'}}>
                                        Датум на заведување *
                                    </Typography>
                                    <DatePicker
                                        value={form.datumZaveduvanje}
                                        onChange={(v) => hc('datumZaveduvanje', v)}
                                        slotProps={{textField: {
                                                fullWidth: true,
                                                error: !!formErrors.datumZaveduvanje,
                                                helperText: formErrors.datumZaveduvanje,
                                            }}}
                                    />
                                </Grid>

                                {/* Тип */}
                                <Grid item xs={12} sm={6} md={2}>
                                    <Typography sx={{fontSize: '0.68rem', color: formErrors.tipPosta ? '#d32f2f' : '#888',
                                        fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'}}>
                                        Тип *
                                    </Typography>
                                    <Box sx={{
                                        border: `1px solid ${formErrors.tipPosta ? '#d32f2f' : '#D8D8D8'}`,
                                        borderRadius: '8px', px: 1.5, py: 1, bgcolor: '#fff'
                                    }}>
                                        <RadioGroup value={form.tipPosta}
                                                    onChange={(e) => hc('tipPosta', e.target.value)}>
                                            {(tipPostaEnum.length > 0 ? tipPostaEnum : ['писмо', 'телеграма']).map(t => (
                                                <FormControlLabel key={t} value={t}
                                                                  control={<Radio size="small" sx={{'&.Mui-checked': {color: T.accent}}}/>}
                                                                  label={<Typography sx={{fontSize: '0.82rem'}}>{t}</Typography>}
                                                                  sx={{m: 0, mb: 0.3}}/>
                                            ))}
                                        </RadioGroup>
                                    </Box>
                                    <Err msg={formErrors.tipPosta}/>
                                </Grid>


                                {/* Приоритет — само добиена */}
                                {isDobiena && (
                                    <Grid item xs={12} sm={6} md={2}>
                                        <Typography sx={{fontSize: '0.68rem', color: formErrors.prioritet ? '#d32f2f' : '#888',
                                            fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'}}>
                                            Приоритет *
                                        </Typography>
                                        <Box sx={{
                                            border: `1px solid ${formErrors.prioritet ? '#d32f2f' : '#D8D8D8'}`,
                                            borderRadius: '8px', px: 1.5, py: 1, bgcolor: '#fff'
                                        }}>
                                            <RadioGroup value={form.prioritet}
                                                        onChange={(e) => hc('prioritet', e.target.value)}>
                                                {(prioritetEnum.length > 0 ? prioritetEnum : ['Висок', 'Нормален']).map(p => (
                                                    <FormControlLabel key={p} value={p}
                                                                      control={<Radio size="small" sx={{'&.Mui-checked': {color: T.accent}}}/>}
                                                                      label={<Typography sx={{fontSize: '0.82rem'}}>{p}</Typography>}
                                                                      sx={{m: 0, mb: 0.3}}/>
                                                ))}
                                            </RadioGroup>
                                        </Box>
                                        <Err msg={formErrors.prioritet}/>
                                    </Grid>
                                )}
                            </Grid>

                        </Section>

                        {/* ── ИСПРАЌАЧ ── */}
                        <Section title={isDobiena ? "Испраќач" : "Испратено до"} theme={T}>
                            <Grid container spacing={2.5}>

                                {/* Испраќач dropdown — поголем */}
                                <Grid item xs={12} md={isDobiena ? 5 : 12}>
                                    {/*{selectedIsprakjac && (*/}
                                    {/*    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.6, mb: 1}}>*/}
                                    {/*        <CheckCircleIcon sx={{fontSize: 13, color: T.accent}}/>*/}
                                    {/*        <Typography sx={{fontSize: '0.75rem', color: T.accentDark, fontWeight: 600}}>*/}
                                    {/*            {selectedIsprakjac.naziv}*/}
                                    {/*        </Typography>*/}
                                    {/*    </Box>*/}
                                    {/*)}*/}
                                    <SingleSelect
                                        label={isDobiena ? "Избери испраќач *" : "Избери примач *"}
                                        value={form.isprakjacId}
                                        onChange={(v) => hc('isprakjacId', v)}
                                        options={isprakjaci || []}
                                        getLabel={(o) => o.naziv}
                                        getId={(o) => o.id}
                                        error={formErrors.isprakjacId}
                                        fullWidth
                                        size="medium"
                                    />
                                </Grid>

                                {/* Бројки — само добиена */}
                                {isDobiena && (
                                    <>
                                        <Grid item xs={12} sm={6} md={3.5}>
                                            <TextField fullWidth
                                                       label="Број на акт (нивни) *"
                                                       placeholder="пр. 12.1.1-924/2-25"
                                                       value={form.brAktNivni}
                                                       error={!!formErrors.brAktNivni}
                                                       helperText={formErrors.brAktNivni || " "}
                                                       onChange={(e) => hc('brAktNivni', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3.5}>
                                            <TextField fullWidth
                                                       label="Број на акт (архивски) "
                                                       value={form.brAktArhivski}
                                                       error={!!formErrors.brAktArhivski}
                                                       helperText={formErrors.brAktArhivski}
                                                       onChange={(e) => hc('brAktArhivski', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <DatePicker
                                                label="Датум на испраќање *"
                                                value={form.datumIsprakjanje}
                                                onChange={(v) => hc('datumIsprakjanje', v)}
                                                slotProps={{textField: {
                                                        fullWidth: true,
                                                        error: !!formErrors.datumIsprakjanje,
                                                        helperText: formErrors.datumIsprakjanje || " ",
                                                    }}}
                                            />
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Section>

                        {/* ── ПРЕДМЕТ ── */}
                        <Section title="Предмет" theme={T}>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12} md={4}>
                                    <Typography sx={{fontSize: '0.68rem', color: formErrors.vidPredmet ? '#d32f2f' : '#888',
                                        fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'}}>
                                        Вид на предмет *
                                    </Typography>
                                    {isDobiena ? (
                                        <MultiSelect
                                            label="Вид на предмет"
                                            value={form.vidPredmetDobienaId}
                                            onChange={(v) => hc('vidPredmetDobienaId', v)}
                                            options={vidPredmetD || []}
                                            getLabel={(o) => o.naziv}
                                            getId={(o) => o.id}
                                            error={formErrors.vidPredmet}
                                            theme={T} fullWidth
                                        />
                                    ) : (
                                        <MultiSelect
                                            label="Вид на предмет"
                                            value={form.vidPredmetIspratenaId}
                                            onChange={(v) => hc('vidPredmetIspratenaId', v)}
                                            options={vidPredmetI || []}
                                            getLabel={(o) => o.naziv}
                                            getId={(o) => o.id}
                                            error={formErrors.vidPredmet}
                                            theme={T} fullWidth
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography sx={{fontSize: '0.68rem', color: formErrors.sodrzina ? '#d32f2f' : '#888',
                                        fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'}}>
                                        Содржина *
                                    </Typography>
                                    <TextField fullWidth multiline rows={5}
                                               label=""
                                               placeholder="Внесете кратка содржина на предметот..."
                                               value={form.sodrzina}
                                               error={!!formErrors.sodrzina}
                                               helperText={formErrors.sodrzina}
                                               onChange={(e) => hc('sodrzina', e.target.value)}
                                               sx={{'& .MuiOutlinedInput-root': {bgcolor: '#fff'},minWidth:800}}
                                    />
                                </Grid>
                            </Grid>
                        </Section>

                        {/* ── ДОДЕЛУВАЊЕ + ДОПОЛНИТЕЛНИ (ред) ── */}
                        <Grid container spacing={2} sx={{mb: 2}}>

                            {/* Доделување */}
                            <Grid item xs={12} md={7}>
                                <Section title="Доделување" theme={T}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <MultiSelect
                                                label="Одговорно лице *"
                                                value={form.odgovornoLiceId}
                                                onChange={(v) => hc('odgovornoLiceId', v)}
                                                options={odgovornoLice || []}
                                                getLabel={(o) => `${o.ime} ${o.prezime}`}
                                                getId={(o) => o.id}
                                                error={formErrors.odgovornoLiceId}
                                                theme={T} fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <MultiSelect
                                                label="Архива"
                                                value={form.arhivaId}
                                                onChange={(v) => hc('arhivaId', v)}
                                                options={arhiva || []}
                                                getLabel={(o) => o.naziv}
                                                getId={(o) => o.id}
                                                theme={T} fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </Section>
                            </Grid>

                            {/* Дополнителни */}
                            <Grid item xs={12} md={5}>
                                <Section title="Дополнителни" theme={T}>
                                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                                        <SwitchCard
                                            label="Информативна пошта"
                                            checked={form.informativnaPosta}
                                            onChange={(v) => hc('informativnaPosta', v)}
                                            theme={T}
                                        />
                                        <SwitchCard
                                            label="Реализирано"
                                            checked={form.realizirano}
                                            onChange={(v) => hc('realizirano', v)}
                                            theme={T}
                                        />
                                    </Box>
                                </Section>
                            </Grid>
                        </Grid>

                        {/* ── ЗАБЕЛЕШКА ── */}
                        <Section title="Забелешка" theme={T}>
                            <TextField fullWidth multiline rows={2}
                                       label=""
                                       placeholder="Опционална забелешка..."
                                       value={form.zabeleska}
                                       onChange={(e) => hc('zabeleska', e.target.value)}
                                       sx={{'& .MuiOutlinedInput-root': {bgcolor: '#fff'}}}
                            />
                        </Section>

                        {/* ── ДОКУМЕНТИ ── */}
                        <Section title="Скенирани документи" theme={T}>
                            <Box
                                ref={dropRef}
                                onDragOver={(e) => {e.preventDefault(); setIsDragging(true);}}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault(); setIsDragging(false);
                                    setAttachedFiles(p => [...p, ...Array.from(e.dataTransfer.files)]);
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    border: `2px dashed ${isDragging ? T.accent : '#D4D4D4'}`,
                                    borderRadius: '10px', p: 3, textAlign: 'center',
                                    cursor: 'pointer', bgcolor: isDragging ? T.chipBg : '#fff',
                                    transition: 'all 0.15s',
                                    mb: attachedFiles.length > 0 ? 1.5 : 0,
                                    '&:hover': {borderColor: T.accent, bgcolor: T.chipBg}
                                }}
                            >
                                <CloudUploadIcon sx={{fontSize: 32, color: isDragging ? T.accent : '#C8C8C8', mb: 0.5}}/>
                                <Typography sx={{fontSize: '0.82rem', color: '#777'}}>
                                    Повлечи тука или{' '}
                                    <span style={{color: T.accent, fontWeight: 600}}>избери датотека</span>
                                </Typography>
                                <Typography sx={{fontSize: '0.68rem', color: '#AAA', mt: 0.3}}>
                                    PDF · DOC · DOCX · JPG · PNG
                                </Typography>
                            </Box>

                            <input type="file" ref={fileInputRef} style={{display: 'none'}}
                                   multiple onChange={(e) => setAttachedFiles(p => [...p, ...Array.from(e.target.files)])}
                            />

                            {attachedFiles.length > 0 && (
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.6}}>
                                    {attachedFiles.map((file, idx) => (
                                        <Box key={idx} sx={{
                                            display: 'flex', alignItems: 'center', gap: 1,
                                            px: 1.5, py: 0.8, bgcolor: '#fff',
                                            border: '1px solid #EAEAEA', borderRadius: '6px'
                                        }}>
                                            <AttachFileIcon sx={{fontSize: 15, color: T.accent}}/>
                                            <Typography sx={{fontSize: '0.8rem', flex: 1, color: '#444'}}>{file.name}</Typography>
                                            <Typography sx={{fontSize: '0.68rem', color: '#AAA', mr: 0.5}}>
                                                {(file.size / 1024).toFixed(0)} KB
                                            </Typography>
                                            <IconButton size="small"
                                                        onClick={(e) => {e.stopPropagation(); setAttachedFiles(p => p.filter((_, i) => i !== idx));}}
                                                        sx={{color: '#CCC', '&:hover': {color: '#d32f2f'}}}>
                                                <DeleteOutlineIcon sx={{fontSize: 15}}/>
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Section>

                        {/* ── ERROR ── */}
                        {error && (
                            <Box sx={{mb: 2, p: 1.5, bgcolor: '#FFF3F3', border: '1px solid #FFCDD2', borderRadius: '6px'}}>
                                <Typography sx={{color: '#C62828', fontSize: '0.8rem'}}>{error}</Typography>
                            </Box>
                        )}

                        {/* ── КОПЧИЊА ── */}
                        <Box sx={{
                            display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center',
                            pt: 2, borderTop: '1px solid #E8E8E8', mt: 1
                        }}>
                            <Button
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={14} sx={{color: '#fff'}}/> : <SaveIcon sx={{fontSize: 16}}/>}
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{
                                    bgcolor: T.btnBg, color: '#fff', fontWeight: 600,
                                    fontSize: '0.82rem', textTransform: 'none', px: 3, py: 0.9,
                                    borderRadius: '8px',
                                    boxShadow: `0 2px 8px ${T.accent}44`,
                                    '&:hover': {bgcolor: T.btnHover, boxShadow: `0 4px 12px ${T.accent}66`},
                                    minWidth: 130
                                }}
                            >
                                {loading ? 'Зачувување...' : 'Зачувај'}
                            </Button>


                            {/*<Box sx={{width: '1px', height: 28, bgcolor: '#E0E0E0', mx: 0.5}}/>*/}

                            {/*{[*/}
                            {/*    {label: 'Одговор испратена', icon: <ReplyIcon sx={{fontSize: 15}}/>},*/}
                            {/*    {label: 'СД одговор', icon: <ReplyIcon sx={{fontSize: 15}}/>},*/}
                            {/*    {label: 'Одговор добиена', icon: <ReplyIcon sx={{fontSize: 15}}/>},*/}
                            {/*].map(({label, icon}) => (*/}
                            {/*    <Button key={label}*/}
                            {/*            variant="outlined"*/}
                            {/*            startIcon={icon}*/}
                            {/*            sx={{*/}
                            {/*                borderColor: '#D8D8D8', color: '#666',*/}
                            {/*                fontWeight: 500, fontSize: '0.78rem',*/}
                            {/*                textTransform: 'none', px: 2, py: 0.9,*/}
                            {/*                borderRadius: '8px',*/}
                            {/*                '&:hover': {borderColor: T.border, color: T.accentDark, bgcolor: T.chipBg}*/}
                            {/*            }}*/}
                            {/*    >*/}
                            {/*        {label}*/}
                            {/*    </Button>*/}
                            {/*))}*/}
                        </Box>

                    </Box>
                </Container>
            </Box>
        </LocalizationProvider>
    );
};

export default PredmetForm;