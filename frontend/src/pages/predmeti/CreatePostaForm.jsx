import {useState, useRef, useEffect} from 'react';
import {
    Box, Typography, Grid, TextField, RadioGroup, FormControlLabel, Radio,
    Button, Divider,
    CircularProgress, Switch, IconButton,
    Backdrop

} from '@mui/material';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import {useSnackbar} from '../../context/SnackbarContext.jsx';
import dayjs from 'dayjs';
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEnums} from "../../hooks/useEnums.js";
import useIsprakjac from "../../hooks/useIsprakjac.js";
import useArhiva from "../../hooks/useArhiva.js";
import useVidPredmetDobieno from "../../hooks/useVidPredmetDobieno.js";
import useVidPredmetIspratena from "../../hooks/useVidPredmetIspratena.js";
import useUsersOdgovornoLice from "../../hooks/useUsersOdgovornoLice.js";
import {useAuth} from "../../context/AuthContext.jsx";
import useOrgEdinica from "../../hooks/useOrgEdinica.js";
import usePredmeti from "../../hooks/usePredmeti.js";
import usePredmetDetails from "../../hooks/usePredmetiDetails.js";
import {predmetiApi} from "../../api/predmeti.js";
import SectionCard from "../../components/common/SectionCard.jsx";
import SingleSelect from "../../components/common/forms/SingleSelect.jsx";
import MultiSelect from "../../components/common/forms/MultiSelect.jsx";
import Err from "../../components/common/forms/ErrorText.jsx";

const THEME = {
    gradient: 'linear-gradient(135deg, #6B0D1E 0%, #9B1D2E 60%, #C8404A 100%)',
    gradientLight: 'linear-gradient(135deg, #FBEEF0 0%, #F6DDE1 100%)',
    border: '#C8A0A6',
    borderLight: '#E3C3C8',
    chipBg: '#f1e9d4',
    chipColor: '#826f35',
    accent: '#826f35',
    accentDark: '#826f35',
    btnBg: '#826f35',
    btnHover: '#5a4d26',
    sectionBg: '#FFF9F9',
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
            <Typography sx={{
                fontSize: '0.75rem', fontWeight: 600, color: checked ? theme.accentDark : '#666',
                letterSpacing: '0.06em', textTransform: 'uppercase'
            }}>
                {label}
            </Typography>
            <Typography sx={{fontSize: '0.68rem', color: checked ? theme.accent : '#999', mt: 0.2}}>
                {checked ? 'Да' : 'Не'}
            </Typography>
        </Box>
        <Switch
            checked={checked}
            onChange={(e) => {
                e.stopPropagation();
                onChange(e.target.checked);
            }}
            size="small"
            sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {color: theme.accent},
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {bgcolor: theme.accent},
            }}
        />
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


// ─── MAIN ─────────────────────────────────────────────────────────────────────
const PredmetForm = () => {
    const [searchParams] = useSearchParams();
    const tipDelovnik = searchParams.get("tipDelovnik") || "Dobiena";
    const isDobiena = tipDelovnik === "Dobiena";
    const T = THEME;
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
        statusPredmet: "",
        isprakjacIme: ""
    });
    const clear = () => setForm({
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
    const {showSnackbar} = useSnackbar();
    const {getOrgEdinicaById} = useOrgEdinica();
    const [orgEdinica, setOrgEdinica] = useState(null);

    const roditelId = searchParams.get("roditelId") ? Number(searchParams.get("roditelId")) : null;
    const tipOdgovor = searchParams.get("tipOdgovor") || null;


    const {predmet: roditel} = usePredmetDetails(roditelId);
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
    const [saving, setSaving] = useState(false);
    const isprakjac = isprakjaci.find(a => a.id === form.isprakjacId)
    const isDrugo = isprakjac?.naziv === 'Друго'
    if (isPageLoading) return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '60vh', gap: 2
        }}>
            <CircularProgress sx={{color: T.accent}} size={40}/>
            <Typography sx={{color: '#888', fontSize: '0.85rem'}}>Се вчитуваат податоците...</Typography>
        </Box>
    );

    const handleSubmit = async () => {
        setSubmitted(true);
        const errs = validate();
        setFormErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setSaving(true);
        console.log(isDrugo)
        const isprakjac_ime = isDrugo ? form.isprakjacIme : isprakjac?.naziv
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
            isprakjacIme: isprakjac_ime
        };
        try {
            console.log(form)
            const savedPredmet = await createPosta(
                payload, tipDelovnik, tipOdgovor,
                roditel?.redenBroj ?? null,
                roditel?.godina ?? null,
                roditel?.podBroj ?? null
            );
            if (attachedFiles.length > 0) {
                for (const file of attachedFiles) {
                    await predmetiApi.uploadDok(savedPredmet.id, file);
                }
            }
            showSnackbar('Успешно зачувано!', 'success');
            setSubmitted(false);
            setFormErrors({});
            navigate("/predmeti")
        } catch (e) {
            console.error(e.response?.data);
            showSnackbar('Грешка при зачувување!', 'error');
            setSaving(false);
        }
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <Box sx={{p: 3}}>

                {/* ── НАСЛОВ (изглед идентичен на DemoApp SectionTitle) ── */}
                <Box sx={{
                    background: 'linear-gradient(240deg, #b6a268 0%, #dbbd5e 70%, #826f35 100%)',
                    borderRadius: '0% 100% 100% 0% / 50% 50% 50% 50%',
                    mb: '5px', px: 2,
                }}>
                    <Typography variant="h6" sx={{color: '#000'}}>
                        {isDobiena ? 'Добиена пошта' : 'Испратена пошта'} — Нов предмет
                    </Typography>
                </Box>
                <Divider/>
                <Typography sx={{color: '#888', fontSize: '1.2rem', mt: 0.5, mb: 2}}>
                    Број на акт: {roditelId
                    ? `${roditel?.brAkt ?? '···'} / ${roditel?.redenBroj ?? '···'} / ${(roditel?.podBroj ?? 0) + 1} / ${roditel?.godina ?? today.year()}`
                    : `${orgEdinica?.code ?? '·····'} / ${nextRedenBroj ?? '···'} / 1 / ${today.year()}`
                }
                </Typography>

                <Box>

                    {/* ── РЕД 1: СТАТУС + ДАТУМ + ТИП ── */}
                    <SectionCard title="Регистрација" theme={T}>
                        <Grid container spacing={1.5} alignItems="flex-start">


                            {/* Датум */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography sx={{
                                    fontSize: '0.68rem', color: formErrors.datumZaveduvanje ? '#d32f2f' : '#888',
                                    fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'
                                }}>
                                    Датум на заведување *
                                </Typography>
                                <DatePicker
                                    value={form.datumZaveduvanje}
                                    onChange={(v) => hc('datumZaveduvanje', v)}
                                    format="DD.MM.YYYY"
                                    slotProps={{
                                        textField: {
                                            variant: 'standard',
                                            size: 'small',
                                            fullWidth: true,
                                            error: !!formErrors.datumZaveduvanje,
                                            helperText: formErrors.datumZaveduvanje,
                                        }
                                    }}

                                />
                            </Grid>

                            {/* Тип */}
                            <Grid item xs={12} sm={6} md={2}>
                                <Typography sx={{
                                    fontSize: '0.68rem', color: formErrors.tipPosta ? '#d32f2f' : '#888',
                                    fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'
                                }}>
                                    Тип *
                                </Typography>
                                <Box sx={{
                                    border: `1px solid ${formErrors.tipPosta ? '#d32f2f' : '#D8D8D8'}`,
                                    borderRadius: '8px', px: 1, py: 0.3, bgcolor: '#fff'  // ← py: 1 → 0.3
                                }}>
                                    <RadioGroup value={form.tipPosta}
                                                onChange={(e) => hc('tipPosta', e.target.value)}>
                                        {(tipPostaEnum.length > 0 ? tipPostaEnum : ['писмо', 'телеграма']).map(t => (
                                            <FormControlLabel key={t} value={t}
                                                              control={<Radio size="small" sx={{
                                                                  '&.Mui-checked': {color: T.accent},
                                                                  p: 0.3
                                                              }}/>}
                                                              label={<Typography
                                                                  sx={{fontSize: '0.78rem'}}>{t}</Typography>}
                                                              sx={{m: 0, mb: 0}}/>
                                        ))}
                                    </RadioGroup>
                                </Box>
                                <Err msg={formErrors.tipPosta}/>
                            </Grid>


                            {/* Приоритет — само добиена */}
                            {isDobiena && (
                                <Grid item xs={12} sm={6} md={2}>
                                    <Typography sx={{
                                        fontSize: '0.68rem', color: formErrors.prioritet ? '#d32f2f' : '#888',
                                        fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'
                                    }}>
                                        Приоритет *
                                    </Typography>
                                    <Box sx={{
                                        border: `1px solid ${formErrors.prioritet ? '#d32f2f' : '#D8D8D8'}`,
                                        borderRadius: '8px', px: 1.5, py: 0.3, bgcolor: '#fff'
                                    }}>
                                        <RadioGroup value={form.prioritet}
                                                    onChange={(e) => hc('prioritet', e.target.value)}>
                                            {(prioritetEnum.length > 0 ? prioritetEnum : ['Висок', 'Нормален']).map(p => (
                                                <FormControlLabel key={p} value={p}
                                                                  control={<Radio size="small" sx={{
                                                                      '&.Mui-checked': {color: T.accent},
                                                                      p: 0.3
                                                                  }}/>}
                                                                  label={<Typography
                                                                      sx={{fontSize: '0.78rem'}}>{p}</Typography>}
                                                                  sx={{m: 0, mb: 0}}/>
                                            ))}
                                        </RadioGroup>
                                    </Box>
                                    <Err msg={formErrors.prioritet}/>
                                </Grid>
                            )}
                        </Grid>

                    </SectionCard>

                    {/* ── ИСПРАЌАЧ ── */}
                    <SectionCard title={isDobiena ? "Испраќач" : "Испратено до"} theme={T}>
                        <Grid container spacing={2.5}>

                            {/* Испраќач dropdown — поголем */}
                            <Grid item xs={12} md={isDobiena ? 3 : 12}>
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
                                    size="small"
                                />
                            </Grid>
                            {isDrugo && (
                                <>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField fullWidth size="small"
                                                   label="Друг испраќач"
                                                   value={form.isprakjacIme}
                                                   error={!!formErrors.isprakjacIme}
                                                   helperText={formErrors.isprakjacIme || " "}
                                                   onChange={(e) => hc('isprakjacIme', e.target.value)}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* Бројки — само добиена */}
                            {isDobiena && (
                                <>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField fullWidth size="small"
                                                   label="Број на акт (нивни) *"
                                                   placeholder="пр. 12.1.1-924/2-25"
                                                   value={form.brAktNivni}
                                                   error={!!formErrors.brAktNivni}
                                                   helperText={formErrors.brAktNivni || " "}
                                                   onChange={(e) => hc('brAktNivni', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField fullWidth size="small"
                                                   label="Број на акт (архивски) "
                                                   value={form.brAktArhivski}
                                                   error={!!formErrors.brAktArhivski}
                                                   helperText={formErrors.brAktArhivski}
                                                   onChange={(e) => hc('brAktArhivski', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <DatePicker
                                            label="Датум на испраќање *"
                                            value={form.datumIsprakjanje}
                                            onChange={(v) => hc('datumIsprakjanje', v)}
                                            format="DD.MM.YYYY"
                                            slotProps={{
                                                textField: {
                                                    variant: 'standard',
                                                    size: 'small',
                                                    fullWidth: true,
                                                    error: !!formErrors.datumIsprakjanje,
                                                    helperText: formErrors.datumIsprakjanje || " ",
                                                }
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </SectionCard>

                    {/* ── ПРЕДМЕТ ── */}
                    <SectionCard title="Предмет" theme={T}>
                        <Grid container spacing={1.5}>
                            <Grid item xs={12} md={3.6}>
                                {/*<Typography sx={{fontSize: '0.68rem', color: formErrors.vidPredmet ? '#d32f2f' : '#888',*/}
                                {/*    fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'}}>*/}
                                {/*    Вид на предмет **/}
                                {/*</Typography>*/}
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
                            <Grid item xs={12} md={8.4}>
                                <Typography sx={{
                                    fontSize: '0.68rem', color: formErrors.sodrzina ? '#d32f2f' : '#888',
                                    fontWeight: 600, letterSpacing: '0.08em', mb: 0.8, textTransform: 'uppercase'
                                }}>
                                    Содржина *
                                </Typography>
                                <TextField fullWidth multiline rows={5}
                                           label=""
                                           placeholder="Внесете кратка содржина на предметот..."
                                           value={form.sodrzina}
                                           error={!!formErrors.sodrzina}
                                           helperText={formErrors.sodrzina}
                                           onChange={(e) => hc('sodrzina', e.target.value)}
                                           sx={{'& .MuiOutlinedInput-root': {bgcolor: '#fff'}, minWidth: 800}}
                                />
                            </Grid>
                        </Grid>
                    </SectionCard>

                    {/* ── ДОДЕЛУВАЊЕ + ДОПОЛНИТЕЛНИ (ред) ── */}
                    <Row gap={1.5}>
                        <Col flex={7} minWidth={280}>
                            <SectionCard title="Доделување" theme={T}>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
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
                                    {/*<Field label="Одговорно лице" theme={T}>*/}
                                    {/*    <Box sx={{*/}
                                    {/*    bgcolor: T.valueBg, border: '1px solid #E8E8E8',*/}
                                    {/*    borderRadius: '6px', px: 1.2, py: 0.6, minHeight: 32*/}
                                    {/*}}>*/}
                                    {/*    <ChipList items={odgovornoLiceList}*/}
                                    {/*              getLabel={(u) => `${u.ime} ${u.prezime}`} theme={T}/>*/}
                                    {/*</Box>*/}
                                    {/*</Field>*/}
                                    {/*<Field label="Архива" theme={T}>*/}
                                    {/*    <Box sx={{*/}
                                    {/*        bgcolor: T.valueBg, border: '1px solid #E8E8E8',*/}
                                    {/*        borderRadius: '6px', px: 1.2, py: 0.6, minHeight: 32*/}
                                    {/*    }}>*/}
                                    {/*        <ChipList items={arhivaList} getLabel={(a) => a.naziv} theme={T}/>*/}
                                    {/*    </Box>*/}
                                    {/*</Field>*/}
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
                                    <Grid item xs={12} md={5}>
                                        <SingleSelect
                                            label="Статус на предмет"
                                            value={form.statusPredmet}
                                            onChange={(v) => hc('statusPredmet', v)}
                                            options={statusEnum?.map(s => ({id: s, naziv: s.replace(/_/g, ' ')})) || []}
                                            getLabel={(o) => o.naziv}
                                            getId={(o) => o.id}
                                            error={formErrors.statusPredmet}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                </Box>
                            </SectionCard>
                        </Col>

                        <Col flex={5} minWidth={220}>
                            <SectionCard title="Дополнителни" theme={T}>
                                {/*<Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>*/}
                                {/*    {[*/}
                                {/*        {label: 'Информативна пошта', value: predmet.informativnaPosta},*/}
                                {/*        {label: 'Реализирано', value: predmet.realizirano},*/}
                                {/*    ].map(({label, value}) => (*/}
                                {/*        <Box key={label} sx={{*/}
                                {/*            border: `1px solid ${value ? T.border : '#E8E8E8'}`,*/}
                                {/*            borderRadius: '8px', px: 1.5, py: 0.8,*/}
                                {/*            display: 'flex', alignItems: 'center',*/}
                                {/*            justifyContent: 'space-between',*/}
                                {/*            bgcolor: value ? T.chipBg : '#fff'*/}
                                {/*        }}>*/}
                                {/*            <Box>*/}
                                {/*                <Typography sx={{*/}
                                {/*                    fontSize: '0.68rem', fontWeight: 600,*/}
                                {/*                    color: value ? T.accentDark : '#888',*/}
                                {/*                    letterSpacing: '0.06em', textTransform: 'uppercase'*/}
                                {/*                }}>*/}
                                {/*                    {label}*/}
                                {/*                </Typography>*/}
                                {/*                <Typography sx={{*/}
                                {/*                    fontSize: '0.65rem', mt: 0.1,*/}
                                {/*                    color: value ? T.accent : '#BBB'*/}
                                {/*                }}>*/}
                                {/*                    {value ? 'Да' : 'Не'}*/}
                                {/*                </Typography>*/}
                                {/*            </Box>*/}
                                {/*            <BoolBadge value={value} theme={T}/>*/}
                                {/*        </Box>*/}
                                {/*    ))}*/}
                                {/*</Box>*/}
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
                            </SectionCard>
                        </Col>
                    </Row>


                    {/* ── ЗАБЕЛЕШКА ── */}
                    <SectionCard title="Забелешка" theme={T}>
                        <TextField fullWidth multiline rows={2}
                                   label=""
                                   placeholder="Опционална забелешка..."
                                   value={form.zabeleska}
                                   onChange={(e) => hc('zabeleska', e.target.value)}
                                   sx={{'& .MuiOutlinedInput-root': {bgcolor: '#fff'}}}
                        />
                    </SectionCard>

                    {/* ── ДОКУМЕНТИ ── */}
                    <SectionCard title="Скенирани документи" theme={T}>
                        <Box
                            ref={dropRef}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                const files = Array.from(e.dataTransfer.files);
                                setAttachedFiles(p => [...p, ...files]);
                                showSnackbar(`${files.length} документ(и) прикачени`, 'info');
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
                               multiple onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setAttachedFiles(p => [...p, ...files]);
                            showSnackbar(`${files.length} документ(и) прикачени`, 'info');
                            e.target.value = '';
                        }}
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
                                        <Typography sx={{fontSize: '0.8rem', flex: 1, color: '#444'}}>
                                            {file.name}
                                        </Typography>
                                        <Typography sx={{fontSize: '0.68rem', color: '#AAA', mr: 0.5}}>
                                            {(file.size / 1024).toFixed(0)} KB
                                        </Typography>
                                        <IconButton size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAttachedFiles(p => p.filter((_, i) => i !== idx));
                                                        showSnackbar('Документот е отстранет', 'warning');
                                                    }}
                                                    sx={{color: '#CCC', '&:hover': {color: '#826f35'}}}>
                                            <DeleteOutlineIcon sx={{fontSize: 15}}/>
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </SectionCard>

                    {/* ── ERROR ── */}
                    {error && (
                        <Box sx={{mb: 2, p: 1.5, bgcolor: '#FFF3F3', border: '1px solid #FFCDD2', borderRadius: '6px'}}>
                            <Typography sx={{color: '#C62828', fontSize: '0.8rem'}}>{error}</Typography>
                        </Box>
                    )}

                    {/* ── КОПЧИЊА ── */}
                    <Box sx={{
                        display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center',
                        pt: 1.5, borderTop: '1px solid #E8E8E8', mt: 0.5
                    }}>
                        <Button
                            variant="contained"
                            startIcon={saving ? <CircularProgress size={14} sx={{color: '#fff'}}/> :
                                <SaveIcon sx={{fontSize: 16}}/>}
                            onClick={handleSubmit}
                            disabled={saving}
                            sx={{
                                bgcolor: T.btnBg, color: '#fff', fontWeight: 600,
                                fontSize: '0.82rem', textTransform: 'none', px: 3, py: 0.9,
                                borderRadius: '8px',
                                boxShadow: `0 2px 8px ${T.accent}44`,
                                '&:hover': {bgcolor: T.btnHover, boxShadow: `0 4px 12px ${T.accent}66`},
                                minWidth: 130
                            }}
                        >
                            {saving ? 'Зачувување...' : 'Зачувај'}
                        </Button>
                    </Box>

                </Box>

                {/* ── ZATEMNUVANJE + BLOKIRANJE DODEKA SE ZACUVUVA ── */}
                <Backdrop
                    open={saving}
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.modal + 1,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        flexDirection: 'column', gap: 2,
                    }}
                >
                    <CircularProgress sx={{color: '#fff'}} size={44}/>
                    <Typography sx={{color: '#fff', fontSize: '0.9rem', fontWeight: 500}}>
                        Се зачувува предметот...
                    </Typography>
                </Backdrop>
            </Box>
        </LocalizationProvider>
    );
};

export default PredmetForm;