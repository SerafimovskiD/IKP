import {useState, useRef, useEffect} from 'react';
import {
    Box, Typography, TextField,
    Button, Divider, Card, CardContent,
    CircularProgress, Switch, IconButton,
    Backdrop, ToggleButton, ToggleButtonGroup

} from '@mui/material';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import {useSnackbar} from '../../context/SnackbarContext.jsx';
import dayjs from 'dayjs';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
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
import SingleSelect from "../../components/common/forms/SingleSelect.jsx";
import MultiSelect from "../../components/common/forms/MultiSelect.jsx";
import ErrorText from "../../components/common/forms/ErrorText.jsx";

// Целосно одделени теми за Добиена (злато/жолто) и Испратена (зелено) пошта -
// исти вредности како во PostaDetails.jsx, за визуелна конзистентност меѓу двете страници.
const DOBIENA = {
    gradient: 'linear-gradient(135deg, #7A5C10 0%, #A9821C 55%, #D4AF37 100%)',
    border: '#C8A84B',
    chipBg: '#FDF3D8',
    chipColor: '#7A5C00',
    accent: '#C8A84B',
    accentDark: '#7A5C00',
    btnBg: '#8B6914',
    btnHover: '#6B4F0E',
    sectionBg: '#FFFDF5',
};

const ISPRATENA = {
    gradient: 'linear-gradient(135deg, #164A1A 0%, #2E7D32 55%, #5CB860 100%)',
    border: '#388E3C',
    chipBg: '#E8F5E9',
    chipColor: '#1B5E20',
    accent: '#388E3C',
    accentDark: '#1B5E20',
    btnBg: '#2E7D32',
    btnHover: '#1B5E20',
    sectionBg: '#F9FDF9',
};

// Вгнездени MUI теми (само primary бојата се менува) - за да сите вградени MUI
// состојаби на активирање/фокус (TextField outline, Autocomplete, DatePicker
// избран ден, итн.) автоматски ги следат бојите на Добиена/Испратена пошта.
const dobienaMuiTheme = createTheme({palette: {primary: {main: DOBIENA.accentDark}}});
const ispratenaMuiTheme = createTheme({palette: {primary: {main: ISPRATENA.accentDark}}});

// ─── SWITCH CARD ──────────────────────────────────────────────────────────────
// Нема фиксна висина - природно се обликува со padding, исто како другите полиња.
const SwitchCard = ({label, checked, onChange, theme}) => (
    <Box sx={{
        border: `1px solid ${checked ? theme.border : '#E8E8E8'}`,
        borderRadius: '8px', px: 1.2,py:0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        bgcolor: checked ? theme.chipBg : '#fff',height:40,
        transition: 'all 0.2s', cursor: 'pointer',
        '&:hover': {borderColor: theme.border}
    }} onClick={() => onChange(!checked)}>
        <Typography sx={{
            fontSize: '0.7rem', fontWeight: 600, color: checked ? theme.accentDark : '#666',
            letterSpacing: '0.04em', textTransform: 'uppercase'
        }}>
            {label}
        </Typography>
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

// ─── СЕГМЕНТИРАНА КОНТРОЛА (како во /predmeti филтерот) - за Тип/Приоритет.
// Нема фиксна висина - контролата ја има својата природна (size="small") висина,
// а порамнувањето со другите полиња се прави преку margin, не преку height.
const ToggleField = ({error, value, onChange, options, theme}) => (
    <Box>
        {/*<Typography sx={{*/}
        {/*    fontSize: '0.7rem', color: error ? '#d32f2f' : '#888',*/}
        {/*    fontWeight: 600, letterSpacing: '0.06em', mb: 0.8, textTransform: 'uppercase'*/}
        {/*}}>*/}
            {/*{label}{required && ' *'}*/}
        {/*</Typography>*/}
        <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={value || null}
            onChange={(_, next) => onChange(next ?? '')}
            sx={{
                '& .MuiToggleButton-root': {
                    textTransform: 'none', fontSize: '0.8rem', fontWeight: 600,
                    color: '#666', borderColor: error ? '#d32f2f' : 'rgba(0,0,0,0.23)',
                    '&.Mui-selected': {
                        bgcolor: theme.accentDark, color: '#fff',
                        '&:hover': {bgcolor: theme.btnHover},
                    },
                },
            }}
        >
            {options.map(opt => (
                <ToggleButton key={opt} value={opt}>
                    {opt}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
        <ErrorText msg={error}/>
    </Box>
);

// ─── РЕД ОД ПОЛИЊА - секое дете подеднакво широко, освен ако не е зададено columns ──
const FormRow = ({children, columns}) => (
    <Box sx={{
        display: 'grid', gap: 2,
        gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: columns || `repeat(${Array.isArray(children) ? children.filter(Boolean).length : 1}, 1fr)`,
        },
    }}>
        {children}
    </Box>
);


// ─── MAIN ─────────────────────────────────────────────────────────────────────
const PredmetForm = () => {
    const [searchParams] = useSearchParams();
    const {id: editId} = useParams();
    const isEditMode = !!editId;
    const tipDelovnik = searchParams.get("tipDelovnik") || "Dobiena";
    const isDobiena = tipDelovnik === "Dobiena";
    const T = isDobiena ? DOBIENA : ISPRATENA;
    const today = dayjs();
    const fileInputRef = useRef(null);
    const dropRef = useRef(null);

    const [form, setForm] = useState({
        datumZaveduvanje: today,
        tipPosta: "писмо",
        prioritet: "",
        isprakjacId: "",
        brAktNivni: "",
        datumIsprakjanje: null,
        brAktArhivski: "",
        vidPredmetDobienaId: [],
        vidPredmetIspratenaId: [],
        sodrzina: "",
        odgovornoLiceId: [],
        dodelenoNaId:[],
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
        dodelenoNaId: [],
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
    // Овозможува клик било каде во полето (не само на календарчето) да го отвори DatePicker-от.
    const [datumZaveduvanjeOpen, setDatumZaveduvanjeOpen] = useState(false);
    const [datumIsprakjanjeOpen, setDatumIsprakjanjeOpen] = useState(false);

    const {prioritet: prioritetEnum, tipPosta: tipPostaEnum, statusPredmet: statusEnum} = useEnums();
    const {createPosta, editPosta, loading, error, nextRedenBroj} = usePredmeti();
    const {isprakjaci, loading: lI} = useIsprakjac();
    const {arhiva, loading: lA} = useArhiva();
    const {vidPredmetD, loading: lVD} = useVidPredmetDobieno();
    const {vidPredmetI, loading: lVI} = useVidPredmetIspratena();
    const {odgovornoLice, dodelenoNa, loading: lO} = useUsersOdgovornoLice();
    const {user} = useAuth();
    const {showSnackbar} = useSnackbar();
    const {getOrgEdinicaById} = useOrgEdinica();
    const [orgEdinica, setOrgEdinica] = useState(null);

    const roditelId = searchParams.get("roditelId") ? Number(searchParams.get("roditelId")) : null;
    const tipOdgovor = searchParams.get("tipOdgovor") || null;


    const {predmet: roditel} = usePredmetDetails(roditelId);
    const {predmet: existingPredmet, loading: lEdit} = usePredmetDetails(editId);
    const [existingDocs, setExistingDocs] = useState([]);
    const [prefillDone, setPrefillDone] = useState(false);

    useEffect(() => {
        if (user?.organizaciskaEdinicaId) {
            getOrgEdinicaById(user.organizaciskaEdinicaId).then(setOrgEdinica);
        }
    }, [user?.organizaciskaEdinicaId]);

    // Пополнување на формата со постоечките податоци кога сме во режим на уредување.
    useEffect(() => {
        if (isEditMode && existingPredmet && !prefillDone) {
            setForm({
                datumZaveduvanje: existingPredmet.datumZaveduvanje ? dayjs(existingPredmet.datumZaveduvanje) : null,
                tipPosta: existingPredmet.tipPosta || "",
                prioritet: existingPredmet.prioritet || "",
                isprakjacId: existingPredmet.isprakjacId || "",
                brAktNivni: existingPredmet.brAktNivni || "",
                datumIsprakjanje: existingPredmet.datumIsprakjanje ? dayjs(existingPredmet.datumIsprakjanje) : null,
                brAktArhivski: existingPredmet.brAktArhivski || "",
                vidPredmetDobienaId: existingPredmet.vidPredmetDobienaId || [],
                vidPredmetIspratenaId: existingPredmet.vidPredmetIspratenaId || [],
                sodrzina: existingPredmet.sodrzina || "",
                odgovornoLiceId: existingPredmet.odgovornoLiceId || [],
                dodelenoNaId: existingPredmet.dodelenoNaId || [],
                informativnaPosta: !!existingPredmet.informativnaPosta,
                realizirano: !!existingPredmet.realizirano,
                arhivaId: existingPredmet.arhivaId || [],
                zabeleska: existingPredmet.zabeleska || "",
                statusPredmet: existingPredmet.statusPredmet || "",
                isprakjacIme: existingPredmet.isprakjacIme || "",
            });
            setPrefillDone(true);
        }
    }, [isEditMode, existingPredmet, prefillDone]);

    useEffect(() => {
        if (isEditMode && editId) {
            predmetiApi.getAllDok(editId).then(setExistingDocs);
        }
    }, [isEditMode, editId]);

    const handleDeleteExistingDok = async (dok) => {
        if (!window.confirm(`Да се отстрани документот „${dok.imeFile}“?`)) return;
        try {
            await predmetiApi.deleteDok(dok.id);
            setExistingDocs(p => p.filter(d => d.id !== dok.id));
            showSnackbar('Документот е отстранет', 'warning');
        } catch {
            showSnackbar('Грешка при бришење на документот!', 'error');
        }
    };

    const isPageLoading = lI || lA || lVD || lVI || lO || (isEditMode && (lEdit || !prefillDone));

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
            dodelenoNaId: form.dodelenoNaId,
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
            const savedPredmet = isEditMode
                ? await editPosta(payload, editId, tipDelovnik)
                : await createPosta(
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
            showSnackbar(isEditMode ? 'Успешно зачувани промени!' : 'Успешно зачувано!', 'success');
            setSubmitted(false);
            setFormErrors({});
            navigate(isEditMode ? `/posta/${editId}` : "/predmeti");
        } catch (e) {
            console.error(e.response?.data);
            showSnackbar('Грешка при зачувување!', 'error');
            setSaving(false);
        }
    };
    const brojNaAkt = isEditMode
        ? `${existingPredmet?.brAkt ?? '···'} / ${existingPredmet?.redenBroj ?? '···'} / ${existingPredmet?.podBroj ?? '···'} / ${existingPredmet?.godina ?? '···'}`
        : roditelId
            ? `${roditel?.brAkt ?? '···'} / ${roditel?.redenBroj ?? '···'} / ${(roditel?.podBroj ?? 0) + 1} / ${roditel?.godina ?? today.year()}`
            : `${orgEdinica?.code ?? '·····'} / ${nextRedenBroj ?? '···'} / 1 / ${today.year()}`;

    return (
        <ThemeProvider theme={isDobiena ? dobienaMuiTheme : ispratenaMuiTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <Box sx={{p: 3}}>

                <Card sx={{
                    borderRadius: '12px', overflow: 'hidden',
                    border: '1px solid #E4E4E4', boxShadow: '0 1px 3px rgba(16,24,40,0.05)'
                }}>

                    {/* ── ЕДИНСТВЕН НАСЛОВ НА КАРТИЧКАТА ── */}
                    <Box sx={{
                        background: T.gradient,
                        px: {xs: 2, md: 3}, py: 1.75,
                        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                        justifyContent: 'space-between', gap: 1,
                    }}>
                        <Typography sx={{color: '#fff', fontWeight: 700, fontSize: '1.05rem'}}>
                            {isDobiena ? 'Добиена пошта' : 'Испратена пошта'} — {isEditMode ? 'Уредување на предмет' : 'Нов предмет'}
                        </Typography>
                        <Typography sx={{
                            color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem',
                            fontFamily: 'monospace', letterSpacing: '0.02em'
                        }}>
                            Број на акт: {brojNaAkt}
                        </Typography>
                    </Box>

                    <CardContent sx={{p: {xs: 2, md: 3}}}>

                        {/* ── СИТЕ ПОЛИЊА ВО РЕДОВИ, БЕЗ ПОДЕЛБА НА СЕКЦИИ ── */}
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>

                            {/* РЕД 1: Датум на заведување, Тип, Приоритет, Испраќач, [Друг испраќач] */}
                            <FormRow>
                                <DatePicker
                                    label="Датум на заведување *"
                                    value={form.datumZaveduvanje}
                                    onChange={(v) => hc('datumZaveduvanje', v)}
                                    format="DD.MM.YYYY"
                                    open={datumZaveduvanjeOpen}
                                    onOpen={() => setDatumZaveduvanjeOpen(true)}
                                    onClose={() => setDatumZaveduvanjeOpen(false)}
                                    slotProps={{
                                        textField: {
                                            size: 'small', fullWidth: true,
                                            error: !!formErrors.datumZaveduvanje,
                                            helperText: formErrors.datumZaveduvanje || ' ',
                                            onClick: () => setDatumZaveduvanjeOpen(true),
                                        }
                                    }}
                                />

                                <ToggleField
                                    label="Тип" required error={formErrors.tipPosta}
                                    value={form.tipPosta}
                                    onChange={(v) => hc('tipPosta', v)}
                                    options={tipPostaEnum.length > 0 ? tipPostaEnum : ['писмо', 'телеграма']}
                                    theme={T}
                                />

                                {isDobiena && (
                                    <ToggleField
                                        label="Приоритет" required error={formErrors.prioritet}
                                        value={form.prioritet}
                                        onChange={(v) => hc('prioritet', v)}
                                        options={prioritetEnum.length > 0 ? prioritetEnum : ['Висок', 'Нормален']}
                                        theme={T}
                                    />
                                )}

                                <SingleSelect
                                    label={isDobiena ? 'Избери испраќач' : 'Избери примач'}
                                    value={form.isprakjacId}
                                    onChange={(v) => hc('isprakjacId', v)}
                                    options={isprakjaci || []}
                                    getLabel={(o) => o.naziv}
                                    getId={(o) => o.id}
                                    error={formErrors.isprakjacId}
                                    fullWidth
                                    size="small"
                                />
                                <TextField fullWidth size="small"
                                           label="Друг испраќач"
                                           value={form.isprakjacIme}
                                           error={!!formErrors.isprakjacIme}
                                           helperText={formErrors.isprakjacIme || ' '}
                                           onChange={(e) => hc('isprakjacIme', e.target.value)}
                                           disabled={!isDrugo}
                                           sx={{visibility: isDrugo ? 'visible' : 'hidden'}}
                                />
                            </FormRow>

                            {/* РЕД 2: Број на акт (нивни), Број на акт (архивски), Датум на испраќање */}
                            {isDobiena && (
                                <FormRow>
                                    <TextField fullWidth size="small"
                                               label="Број на акт (нивни)"
                                               placeholder="пр. 12.1.1-924/2-25"
                                               value={form.brAktNivni}
                                               error={!!formErrors.brAktNivni}
                                               helperText={formErrors.brAktNivni || ' '}
                                               onChange={(e) => hc('brAktNivni', e.target.value)}
                                    />
                                    <TextField fullWidth size="small"
                                               label="Број на акт (архивски)"
                                               value={form.brAktArhivski}
                                               error={!!formErrors.brAktArhivski}
                                               helperText={formErrors.brAktArhivski || ' '}
                                               onChange={(e) => hc('brAktArhivski', e.target.value)}
                                    />
                                    <DatePicker
                                        label="Датум на испраќање"
                                        value={form.datumIsprakjanje}
                                        onChange={(v) => hc('datumIsprakjanje', v)}
                                        format="DD.MM.YYYY"
                                        open={datumIsprakjanjeOpen}
                                        onOpen={() => setDatumIsprakjanjeOpen(true)}
                                        onClose={() => setDatumIsprakjanjeOpen(false)}
                                        slotProps={{
                                            textField: {
                                                size: 'small', fullWidth: true,
                                                error: !!formErrors.datumIsprakjanje,
                                                helperText: formErrors.datumIsprakjanje || ' ',
                                                onClick: () => setDatumIsprakjanjeOpen(true),
                                            }
                                        }}
                                    />
                                </FormRow>
                            )}

                            {/* РЕД 3: Вид на предмет, Информативна пошта, Реализирано */}
                            <FormRow columns="2fr 1fr 1fr">
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
                            </FormRow>

                            {/* РЕД 4: Содржина */}
                            <TextField fullWidth multiline rows={4}
                                       label="Содржина"
                                       placeholder="Внесете кратка содржина на предметот..."
                                       value={form.sodrzina}
                                       error={!!formErrors.sodrzina}
                                       helperText={formErrors.sodrzina || ' '}
                                       onChange={(e) => hc('sodrzina', e.target.value)}
                                       sx={{'& .MuiOutlinedInput-root': {bgcolor: '#fff'}}}
                            />

                            {/* РЕД 5: Одговорно лице, Архива */}
                            <FormRow columns="1fr 1fr 1fr">
                                <MultiSelect
                                    label="Одговорно лице"
                                    value={form.odgovornoLiceId}
                                    onChange={(v) => hc('odgovornoLiceId', v)}
                                    options={odgovornoLice || []}
                                    getLabel={(o) => `${o.ime} ${o.prezime}`}
                                    getId={(o) => o.id}
                                    error={formErrors.odgovornoLiceId}
                                    theme={T} fullWidth
                                />
                                <MultiSelect
                                    label="Доделено на"
                                    value={form.dodelenoNaId}
                                    onChange={(v) => hc('dodelenoNaId', v)}
                                    options={dodelenoNa || []}
                                    getLabel={(o) => `${o.ime} ${o.prezime}`}
                                    getId={(o) => o.id}
                                    error={formErrors.dodelenoNaId}
                                    theme={T} fullWidth
                                />
                                <MultiSelect
                                    label="Архива"
                                    value={form.arhivaId}
                                    onChange={(v) => hc('arhivaId', v)}
                                    options={arhiva || []}
                                    getLabel={(o) => o.naziv}
                                    getId={(o) => o.id}
                                    theme={T} fullWidth
                                />
                            </FormRow>

                            {/* РЕД 6: Забелешка (80%), Статус на предмет (20%) */}
                            <FormRow columns="4fr 1fr">
                                <TextField fullWidth multiline rows={2}
                                           label="Забелешка"
                                           placeholder="Опционална забелешка..."
                                           value={form.zabeleska}
                                           onChange={(e) => hc('zabeleska', e.target.value)}
                                           sx={{'& .MuiOutlinedInput-root': {bgcolor: '#fff'}}}
                                />
                                <SingleSelect
                                    label="Статус на предмет"
                                    value={form.statusPredmet}
                                    onChange={(v) => hc('statusPredmet', v)}
                                    options={statusEnum
                                        ?.filter(s => s.startsWith(isDobiena ? 'ДП' : 'ИП'))
                                        .map(s => ({id: s, naziv: s.replace(/_/g, ' ')})) || []}
                                    getLabel={(o) => o.naziv}
                                    getId={(o) => o.id}
                                    error={formErrors.statusPredmet}
                                    fullWidth
                                    size="small"
                                />
                            </FormRow>
                        </Box>

                        <Divider sx={{my: 2.5}}/>

                        {/* ── ПОСТОЈНИ ДОКУМЕНТИ (само во режим на уредување) ── */}
                        {isEditMode && existingDocs.length > 0 && (
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.6, mb: 1.5}}>
                                {existingDocs.map(dok => (
                                    <Box key={dok.id} sx={{
                                        display: 'flex', alignItems: 'center', gap: 1,
                                        px: 1.5, py: 0.8, bgcolor: '#fff',
                                        border: '1px solid #EAEAEA', borderRadius: '6px',
                                        cursor: 'pointer',
                                        '&:hover': {bgcolor: T.chipBg}
                                    }}
                                         onClick={() => predmetiApi.downloadDok(dok.id, dok.imeFile)}
                                    >
                                        <AttachFileIcon sx={{fontSize: 15, color: T.accent}}/>
                                        <Typography sx={{fontSize: '0.8rem', flex: 1, color: '#444'}}>
                                            {dok.imeFile}
                                        </Typography>
                                        <Typography sx={{fontSize: '0.68rem', color: '#999'}}>
                                            {dok.tipFile}
                                        </Typography>
                                        <IconButton size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteExistingDok(dok);
                                                    }}
                                                    sx={{color: '#CCC', '&:hover': {color: '#d32f2f'}}}>
                                            <DeleteOutlineIcon sx={{fontSize: 15}}/>
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* ── ДОКУМЕНТИ ── */}
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
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.6, mt: 1.5}}>
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

                        {/* ── ERROR ── */}
                        {error && (
                            <Box sx={{
                                mt: 3, p: 1.5, bgcolor: '#FFF3F3',
                                border: '1px solid #FFCDD2', borderRadius: '6px'
                            }}>
                                <Typography sx={{color: '#C62828', fontSize: '0.8rem'}}>{error}</Typography>
                            </Box>
                        )}
                    </CardContent>

                    {/* ── ФУТЕР СО КОПЧЕТО ── */}
                    <Box sx={{
                        display: 'flex', justifyContent: 'flex-end',
                        px: {xs: 2, md: 3}, py: 2,
                        bgcolor: '#FAFAF9', borderTop: '1px solid #EEE',
                    }}>
                        <Button
                            variant="contained"
                            disableElevation
                            startIcon={saving ? <CircularProgress size={14} sx={{color: '#fff'}}/> :
                                <SaveIcon sx={{fontSize: 16}}/>}
                            onClick={handleSubmit}
                            disabled={saving}
                            sx={{
                                bgcolor: T.btnBg, color: '#fff', fontWeight: 600,
                                fontSize: '0.85rem', textTransform: 'none', px: 3.5, py: 1,
                                borderRadius: '8px',
                                '&:hover': {bgcolor: T.btnHover},
                                minWidth: 140
                            }}
                        >
                            {saving ? 'Зачувување...' : (isEditMode ? 'Зачувај промени' : 'Зачувај')}
                        </Button>
                    </Box>
                </Card>

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
        </ThemeProvider>
    );
};

export default PredmetForm;