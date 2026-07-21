import {useState, useMemo, useRef, useEffect} from 'react';
import {
    Box, Container, Typography, Grid, TextField,
    FormControl, RadioGroup, FormControlLabel, Radio,
    Button, Chip, OutlinedInput, Select, MenuItem,
    InputLabel, InputAdornment, ListSubheader, Divider, CircularProgress
} from '@mui/material';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import dayjs from 'dayjs';
import {useSearchParams} from "react-router-dom";
import {useEnums} from "../../../hooks/useEnums.js";
import useIsprakjac from "../../../hooks/useIsprakjac.js";
import useArhiva from "../../../hooks/useArhiva.js";
import useVidPredmetDobieno from "../../../hooks/useVidPredmetDobieno.js";
import useVidPredmetIspratena from "../../../hooks/useVidPredmetIspratena.js";
import useUsersOdgovornoLice from "../../../hooks/useUsersOdgovornoLice.js";
import {useAuth} from "../../../context/AuthContext.jsx";
import useOrgEdinica from "../../../hooks/useOrgEdinica.js";
import usePredmeti from "../../../hooks/usePredmeti.js";

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

const MENU_PROPS = {
    anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
    transformOrigin: {vertical: 'top', horizontal: 'left'},
    slotProps: {paper: {sx: {maxHeight: 320}}}
};

const ErrorText = ({msg}) => msg ? (
    <Typography sx={{color: '#d32f2f', fontSize: '0.72rem', mt: 0.4, ml: 0.5}}>
        {msg}
    </Typography>
) : null;

const RequiredLabel = ({children, color, hasError}) => (
    <Typography component="span"
                sx={{color: hasError ? '#d32f2f' : (color || '#8B4513'), fontWeight: 'bold', fontSize: '0.9rem'}}>
        {children} <span style={{color: '#d32f2f'}}>*</span>
    </Typography>
);

const Label = ({children, required, color, hasError}) => (
    required
        ? <RequiredLabel color={color} hasError={hasError}>{children}</RequiredLabel>
        : <Typography component="span" sx={{color: color || '#8B4513', fontWeight: 'bold', fontSize: '0.9rem'}}>
            {children}
        </Typography>
);

const FieldRow = ({label, children, labelColor, required, hasError}) => (
    <Grid container spacing={1} alignItems="flex-start" sx={{mb: 1.5}}>
        <Grid item xs={12} sm={3} sx={{pt: '10px !important'}}>
            <Label color={labelColor} required={required} hasError={hasError}>{label}:</Label>
        </Grid>
        <Grid item xs={12} sm={9}>{children}</Grid>
    </Grid>
);

const SearchableSingleSelect = ({label, value, onChange, options, getLabel, getId, minWidth = 350, colors, error}) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search) return options;
        return options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase()));
    }, [search, options, getLabel]);

    return (
        <FormControl size="small" sx={{minWidth, bgcolor: '#fff'}} error={!!error}>
            <InputLabel sx={error ? {color: '#d32f2f'} : {}}>{label}</InputLabel>
            <Select
                label={label} value={value}
                onChange={(e) => onChange(e.target.value)}
                onClose={() => setSearch('')}
                MenuProps={{...MENU_PROPS, autoFocus: false}}
                sx={error ? {
                    '& .MuiOutlinedInput-notchedOutline': {borderColor: '#d32f2f !important'}
                } : {}}
            >
                <ListSubheader sx={{p: 1, bgcolor: '#fff'}}>
                    <TextField
                        size="small" fullWidth placeholder="Пребарај..."
                        autoFocus value={search}
                        onChange={(e) => {e.stopPropagation(); setSearch(e.target.value);}}
                        onKeyDown={(e) => e.stopPropagation()}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small"/>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </ListSubheader>
                <ListSubheader sx={{py: 0.3, bgcolor: '#f9f9f9', lineHeight: '1.8'}}/>
                {filtered.map(o => (
                    <MenuItem key={getId(o)} value={getId(o)}>{getLabel(o)}</MenuItem>
                ))}
            </Select>
            <ErrorText msg={error}/>
        </FormControl>
    );
};

const SearchableMultiSelect = ({label, value, onChange, options, getLabel, getId, maxWidth, colors, error}) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search) return options;
        return options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase()));
    }, [search, options, getLabel]);

    return (
        <FormControl fullWidth size="small" sx={maxWidth ? {maxWidth} : {}} error={!!error}>
            <InputLabel sx={error ? {color: '#d32f2f'} : {}}>{label}</InputLabel>
            <Select
                multiple label={label} value={value}
                onChange={(e) => onChange(e.target.value)}
                onClose={() => setSearch('')}
                input={<OutlinedInput label={label}/>}
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        {selected.map(id => {
                            const item = options.find(o => getId(o) === id);
                            return (
                                <Chip key={id} label={item ? getLabel(item) : id}
                                      size="small"
                                      sx={{bgcolor: colors?.chipBg || '#E8D8A0', fontSize: '0.75rem'}}/>
                            );
                        })}
                    </Box>
                )}
                MenuProps={{...MENU_PROPS, autoFocus: false}}
                sx={error ? {
                    '& .MuiOutlinedInput-notchedOutline': {borderColor: '#d32f2f !important'}
                } : {}}
            >
                <ListSubheader sx={{p: 1, bgcolor: '#fff'}}>
                    <TextField
                        size="small" fullWidth placeholder="Пребарај..."
                        autoFocus value={search}
                        onChange={(e) => {e.stopPropagation(); setSearch(e.target.value);}}
                        onKeyDown={(e) => e.stopPropagation()}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small"/>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </ListSubheader>
                <ListSubheader sx={{py: 0.3, bgcolor: '#f9f9f9', lineHeight: '1.8'}}/>
                {filtered.map(o => (
                    <MenuItem key={getId(o)} value={getId(o)}>{getLabel(o)}</MenuItem>
                ))}
            </Select>
            <ErrorText msg={error}/>
        </FormControl>
    );
};

const ActionButton = ({children, onClick, disabled, loading, colors}) => (
    <Button fullWidth variant="contained" onClick={onClick} disabled={disabled}
            sx={{
                bgcolor: colors?.buttonBg || '#D4A843', color: '#fff',
                fontWeight: 'bold', fontSize: '0.8rem',
                '&:hover': {filter: 'brightness(0.9)'},
                textTransform: 'none', py: 1, lineHeight: 1.4
            }}>
        {loading ? 'Се зачувува...' : children}
    </Button>
);

const PredmetForm = () => {
    const [searchParams] = useSearchParams();
    const tipDelovnik = searchParams.get("tipDelovnik") || "Dobiena";
    const isDobiena = tipDelovnik === "Dobiena";
    const COLORS = isDobiena ? DOBIENA_COLORS : ISPRATENA_COLORS;

    const today = dayjs();
    const fileInputRef = useRef(null);

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

    const [formErrors, setFormErrors] = useState({});
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const {prioritet, tipPosta, statusPredmet} = useEnums();
    const {createPosta, loading, error, nextRedenBroj} = usePredmeti();
    const {isprakjaci, loading: loadingIsprakjaci} = useIsprakjac();
    const {arhiva, loading: loadingArhiva} = useArhiva();
    const {vidPredmetD, loading: loadingVidPredmetD} = useVidPredmetDobieno();
    const {vidPredmetI, loading: loadingVidPredmetI} = useVidPredmetIspratena();
    const {odgovornoLice, loading: loadingOdgovornoLice} = useUsersOdgovornoLice();
    const {user} = useAuth();
    const {getOrgEdinicaById} = useOrgEdinica();
    const [orgEdinica, setOrgEdinica] = useState(null);

    useEffect(() => {
        if (user?.organizaciskaEdinicaId) {
            getOrgEdinicaById(user.organizaciskaEdinicaId).then(res => setOrgEdinica(res));
        }
    }, [user?.organizaciskaEdinicaId]);

    const isPageLoading = loadingIsprakjaci || loadingArhiva || loadingVidPredmetD || loadingVidPredmetI || loadingOdgovornoLice;

    const handleChange = (field, value) => {
        setForm(prev => ({...prev, [field]: value}));
        // Исчисти грешка при промена
        if (submitted) {
            setFormErrors(prev => ({...prev, [field]: null}));
        }
    };

    const handleFileAttach = (e) => {
        const files = Array.from(e.target.files);
        setAttachedFiles(prev => [...prev, ...files]);
    };

    const handleRemoveFile = (index) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const validate = (currentForm = form) => {
        const errors = {};

        if (!currentForm.statusPredmet) errors.statusPredmet = "Задолжително поле";
        if (!currentForm.datumZaveduvanje) errors.datumZaveduvanje = "Задолжително поле";
        if (!currentForm.tipPosta) errors.tipPosta = "Задолжително поле";
        if (!currentForm.isprakjacId) errors.isprakjacId = "Задолжително поле";
        if (!currentForm.sodrzina?.trim()) errors.sodrzina = "Задолжително поле";
        if (currentForm.odgovornoLiceId.length === 0) errors.odgovornoLiceId = "Задолжително поле";

        if (isDobiena) {
            if (!currentForm.prioritet) errors.prioritet = "Задолжително поле";
            if (!currentForm.brAktNivni?.trim()) errors.brAktNivni = "Задолжително поле";
            if (!currentForm.brAktArhivski?.trim()) errors.brAktArhivski = "Задолжително поле";
            if (!currentForm.datumIsprakjanje) errors.datumIsprakjanje = "Задолжително поле";
            if (currentForm.vidPredmetDobienaId.length === 0) errors.vidPredmet = "Задолжително поле";
        } else {
            if (currentForm.vidPredmetIspratenaId.length === 0) errors.vidPredmet = "Задолжително поле";
        }

        return errors;
    };

    // Live validation по submit
    useEffect(() => {
        if (submitted) {
            setFormErrors(validate());
        }
    }, [form, submitted]);

    const handleSubmit = async () => {
        setSubmitted(true);
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

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
            ...(!isDobiena && {
                vidPredmetIspratenaId: form.vidPredmetIspratenaId,
            }),
        };

        try {
            await createPosta(payload, tipDelovnik);
            alert('Успешно зачувано!');
            setSubmitted(false);
            setFormErrors({});
        } catch (e) {
            console.error("STATUS:", e.response?.status);
            console.error("DATA:", JSON.stringify(e.response?.data));
        }
    };

    const selectedIsprakjac = isprakjaci?.find(i => i.id === form.isprakjacId);

    if (isPageLoading) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '60vh', gap: 2}}>
                <CircularProgress sx={{color: COLORS.buttonBg}} size={48}/>
                <Typography sx={{color: COLORS.labelColor, fontWeight: 'bold'}}>
                    Ве молиме почекајте...
                </Typography>
            </Box>
        );
    }

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
                            ? `Деловодник на добиена пошта за ${today.year()} година`
                            : `Деловодник на испратена пошта за ${today.year()} година`
                        }
                    </Typography>
                </Box>

                {/* СТАТУС */}
                <Box sx={{mb: 1.5}}>
                    <Label color={COLORS.labelColor}>Статус на предмет: <span style={{color:'red'}}>*</span></Label>
                    <FormControl size="small"
                                 sx={{mt: 0.5, minWidth: 350, bgcolor: '#fff'}}
                                 error={!!formErrors.statusPredmet}>
                        <InputLabel sx={formErrors.statusPredmet ? {color: '#d32f2f'} : {}}>
                            Избери статус
                        </InputLabel>
                        <Select
                            label="Избери статус"
                            value={form.statusPredmet}
                            onChange={(e) => handleChange('statusPredmet', e.target.value)}
                            MenuProps={MENU_PROPS}
                            sx={formErrors.statusPredmet ? {
                                '& .MuiOutlinedInput-notchedOutline': {borderColor: '#d32f2f !important'}
                            } : {}}
                        >
                            {statusPredmet.map(s => (
                                <MenuItem key={s} value={s}>{s}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <ErrorText msg={formErrors.statusPredmet}/>
                </Box>


                <Box sx={{
                    bgcolor: COLORS.sectionBg,
                    border: `1px solid ${COLORS.borderColor}`,
                    borderRadius: '4px',
                    p: 2.5
                }}>
                    {/* БР. НА АКТ + ДАТУМ */}
                    <Grid container spacing={2} alignItems="center" sx={{mb: 2}}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                                <Label color={COLORS.labelColor}>Број на актот:</Label>
                                <Box sx={{bgcolor: isDobiena ? '#C8E0FF' : '#C8F0C8',cursor:'not-allowed', border: `1px solid ${COLORS.borderColor}`,
                                    borderRadius: '3px', px: 1.5, py: 0.3}}>
                                    <Typography sx={{fontWeight: 'bold', color: '#333', fontSize: '0.95rem'}}>
                                        {orgEdinica?.code ?? '...'}
                                    </Typography>
                                </Box>
                                <Typography sx={{fontWeight: 'bold'}}>-</Typography>
                                <Box sx={{bgcolor: isDobiena ? '#C8E0FF' : '#C8F0C8',
                                    border: `1px solid ${COLORS.borderColor}`,
                                    borderRadius: '3px', px: 1.5, py: 0.3}}>
                                    <Typography sx={{fontWeight: 'bold',
                                        color: isDobiena ? '#003080' : '#003800'}}>
                                        {nextRedenBroj ?? '...'}
                                    </Typography>
                                </Box>
                                <Typography sx={{fontWeight: 'bold'}}>/</Typography>
                                <Box sx={{bgcolor: isDobiena ? '#C8E0FF' : '#C8F0C8',
                                    border: `1px solid ${COLORS.borderColor}`,
                                    borderRadius: '3px', px: 1.5, py: 0.3}}>
                                    <Typography sx={{fontWeight: 'bold',
                                        color: isDobiena ? '#003080' : '#003800'}}>1</Typography>
                                </Box>
                                <Typography sx={{fontWeight: 'bold', color: '#333'}}>{today.year()} год.</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Label required color={COLORS.labelColor} hasError={!!formErrors.datumZaveduvanje}>
                                    Датум на заведување:
                                </Label>
                                <Box>
                                    <DatePicker
                                        value={form.datumZaveduvanje}
                                        onChange={(val) => handleChange('datumZaveduvanje', val)}
                                        slotProps={{textField: {
                                                size: 'small',
                                                error: !!formErrors.datumZaveduvanje,
                                                sx: {bgcolor: '#fff', width: 160}
                                            }}}
                                    />
                                    <ErrorText msg={formErrors.datumZaveduvanje}/>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* ТИП + ПРИОРИТЕТ */}
                    <Grid container spacing={2} sx={{mb: 2}}>
                        <Grid item xs={12} sm={isDobiena ? 6 : 12}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                <Label required color={COLORS.labelColor} hasError={!!formErrors.tipPosta}>
                                    Тип на {isDobiena ? 'добиена' : 'испратена'} пошта:
                                </Label>
                                <Box sx={{
                                    border: `1px solid ${formErrors.tipPosta ? '#d32f2f' : COLORS.borderColor}`,
                                    borderRadius: '3px', bgcolor: '#fff', px: 1.5, py: 0.5
                                }}>
                                    <RadioGroup value={form.tipPosta}
                                                onChange={(e) => handleChange('tipPosta', e.target.value)}>
                                        {(tipPosta.length > 0 ? tipPosta : ['писмо', 'телеграма']).map(t => (
                                            <FormControlLabel key={t} value={t}
                                                              control={<Radio size="small" sx={{py: 0.2,
                                                                  '&.Mui-checked': {color: COLORS.buttonBg}}}/>}
                                                              label={<Typography sx={{fontSize: '0.85rem'}}>{t}</Typography>}
                                                              sx={{m: 0}}/>
                                        ))}
                                    </RadioGroup>
                                </Box>
                            </Box>
                            <ErrorText msg={formErrors.tipPosta}/>
                        </Grid>

                        {isDobiena && (
                            <Grid item xs={12} sm={6}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                    <Label required color={COLORS.labelColor} hasError={!!formErrors.prioritet}>
                                        Приоритет:
                                    </Label>
                                    <Box sx={{
                                        border: `1px solid ${formErrors.prioritet ? '#d32f2f' : COLORS.borderColor}`,
                                        borderRadius: '3px', bgcolor: '#fff', px: 1.5, py: 0.5
                                    }}>
                                        <RadioGroup value={form.prioritet}
                                                    onChange={(e) => handleChange('prioritet', e.target.value)}>
                                            {(prioritet.length > 0 ? prioritet : ['Висок', 'Нормален']).map(p => (
                                                <FormControlLabel key={p} value={p}
                                                                  control={<Radio size="small" sx={{py: 0.2,
                                                                      '&.Mui-checked': {color: COLORS.buttonBg}}}/>}
                                                                  label={<Typography sx={{fontSize: '0.85rem'}}>{p}</Typography>}
                                                                  sx={{m: 0}}/>
                                            ))}
                                        </RadioGroup>
                                    </Box>
                                </Box>
                                <ErrorText msg={formErrors.prioritet}/>
                            </Grid>
                        )}
                    </Grid>

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* ИСПРАЌАЧ */}
                    <Box sx={{mb: 2}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                            <Label required color={COLORS.labelColor} hasError={!!formErrors.isprakjacId}>
                                {isDobiena ? 'Испраќач' : 'Испратено до'}:
                            </Label>
                            {selectedIsprakjac && (
                                <Typography sx={{fontWeight: 'bold', color: '#333'}}>
                                    {selectedIsprakjac.naziv}
                                </Typography>
                            )}
                        </Box>
                        <SearchableSingleSelect
                            label={isDobiena ? "Избери испраќач" : "Избери примач"}
                            value={form.isprakjacId}
                            onChange={(val) => handleChange('isprakjacId', val)}
                            options={isprakjaci || []}
                            getLabel={(o) => o.naziv}
                            getId={(o) => o.id}
                            minWidth={400}
                            colors={COLORS}
                            error={formErrors.isprakjacId}
                        />
                    </Box>

                    {/* БР. АКТ — само добиена */}
                    {isDobiena && (
                        <Grid container spacing={2} sx={{mb: 2}}>
                            <Grid item xs={12} sm={4}>
                                <Label required color={COLORS.labelColor} hasError={!!formErrors.brAktNivni}>
                                    Број на акт (нивни):
                                </Label>
                                <TextField fullWidth size="small"
                                           placeholder="пр. 12.1.1-924/2-25"
                                           value={form.brAktNivni}
                                           error={!!formErrors.brAktNivni}
                                           helperText={formErrors.brAktNivni}
                                           onChange={(e) => handleChange('brAktNivni', e.target.value)}
                                           sx={{mt: 0.5, bgcolor: '#fff'}}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Label required color={COLORS.labelColor} hasError={!!formErrors.datumIsprakjanje}>
                                    Датум на испраќање:
                                </Label>
                                <DatePicker
                                    value={form.datumIsprakjanje}
                                    onChange={(val) => handleChange('datumIsprakjanje', val)}
                                    slotProps={{textField: {
                                            size: 'small', fullWidth: true,
                                            error: !!formErrors.datumIsprakjanje,
                                            helperText: formErrors.datumIsprakjanje,
                                            sx: {mt: 0.5, bgcolor: '#fff'}
                                        }}}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Label required color={COLORS.labelColor} hasError={!!formErrors.brAktArhivski}>
                                    Број на акт (архивски):
                                </Label>
                                <TextField fullWidth size="small"
                                           value={form.brAktArhivski}
                                           error={!!formErrors.brAktArhivski}
                                           helperText={formErrors.brAktArhivski}
                                           onChange={(e) => handleChange('brAktArhivski', e.target.value)}
                                           sx={{mt: 0.5, bgcolor: '#fff'}}/>
                            </Grid>
                        </Grid>
                    )}

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* ВИД НА ПРЕДМЕТ */}
                    <Box sx={{mb: 1.5}}>
                        <Label required color={COLORS.labelColor} hasError={!!formErrors.vidPredmet}>
                            Вид на предмет:
                        </Label>
                        <Box sx={{mt: 0.5}}>
                            {isDobiena ? (
                                <SearchableMultiSelect
                                    label="Избери вид"
                                    value={form.vidPredmetDobienaId}
                                    onChange={(val) => handleChange('vidPredmetDobienaId', val)}
                                    options={vidPredmetD || []}
                                    getLabel={(o) => o.naziv}
                                    getId={(o) => o.id}
                                    maxWidth={450}
                                    colors={COLORS}
                                    error={formErrors.vidPredmet}
                                />
                            ) : (
                                <SearchableMultiSelect
                                    label="Избери вид"
                                    value={form.vidPredmetIspratenaId}
                                    onChange={(val) => handleChange('vidPredmetIspratenaId', val)}
                                    options={vidPredmetI || []}
                                    getLabel={(o) => o.naziv}
                                    getId={(o) => o.id}
                                    maxWidth={450}
                                    colors={COLORS}
                                    error={formErrors.vidPredmet}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* СОДРЖИНА */}
                    <Box sx={{mb: 2}}>
                        <Label required color={COLORS.labelColor} hasError={!!formErrors.sodrzina}>
                            Содржина:
                        </Label>
                        <TextField fullWidth multiline rows={4}
                                   placeholder="Кратка содржина на предметот..."
                                   value={form.sodrzina}
                                   error={!!formErrors.sodrzina}
                                   helperText={formErrors.sodrzina}
                                   onChange={(e) => handleChange('sodrzina', e.target.value)}
                                   sx={{mt: 0.5, bgcolor: '#fff'}}/>
                    </Box>

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* ОДГОВОРНО ЛИЦЕ */}
                    <Box sx={{mb: 1.5}}>
                        <Label required color={COLORS.labelColor} hasError={!!formErrors.odgovornoLiceId}>
                            Одговорно лице:
                        </Label>
                        <Box sx={{mt: 0.5}}>
                            <SearchableMultiSelect
                                label="Избери одговорно лице"
                                value={form.odgovornoLiceId}
                                onChange={(val) => handleChange('odgovornoLiceId', val)}
                                options={odgovornoLice || []}
                                getLabel={(o) => `${o.ime} ${o.prezime} — ${o.uloga}`}
                                getId={(o) => o.id}
                                maxWidth={550}
                                colors={COLORS}
                                error={formErrors.odgovornoLiceId}
                            />
                        </Box>
                    </Box>

                    {/* ИНФОРМАТИВНА ПОШТА */}
                    <FieldRow label="Информативна пошта" labelColor={COLORS.labelColor}>
                        <RadioGroup row
                                    value={form.informativnaPosta ? "da" : "ne"}
                                    onChange={(e) => handleChange('informativnaPosta', e.target.value === 'da')}>
                            <FormControlLabel value="da"
                                              control={<Radio size="small" sx={{'&.Mui-checked': {color: COLORS.buttonBg}}}/>}
                                              label={<Typography sx={{fontSize: '0.85rem'}}>Да</Typography>}/>
                            <FormControlLabel value="ne"
                                              control={<Radio size="small" sx={{'&.Mui-checked': {color: COLORS.buttonBg}}}/>}
                                              label={<Typography sx={{fontSize: '0.85rem'}}>Не</Typography>}/>
                        </RadioGroup>
                    </FieldRow>

                    {/* РЕАЛИЗИРАНО */}
                    <FieldRow label="Реализирано" labelColor={COLORS.labelColor}>
                        <RadioGroup row
                                    value={form.realizirano ? "da" : "ne"}
                                    onChange={(e) => handleChange('realizirano', e.target.value === 'da')}>
                            <FormControlLabel value="da"
                                              control={<Radio size="small" sx={{'&.Mui-checked': {color: COLORS.buttonBg}}}/>}
                                              label={<Typography sx={{fontSize: '0.85rem'}}>Да</Typography>}/>
                            <FormControlLabel value="ne"
                                              control={<Radio size="small" sx={{'&.Mui-checked': {color: COLORS.buttonBg}}}/>}
                                              label={<Typography sx={{fontSize: '0.85rem'}}>Не</Typography>}/>
                        </RadioGroup>
                    </FieldRow>

                    {/* АРХИВА */}
                    <Box sx={{mb: 1.5}}>
                        <Label color={COLORS.labelColor}>Архива:</Label>
                        <Box sx={{mt: 0.5}}>
                            <SearchableMultiSelect
                                label="Избери архива"
                                value={form.arhivaId}
                                onChange={(val) => handleChange('arhivaId', val)}
                                options={arhiva || []}
                                getLabel={(o) => o.naziv}
                                getId={(o) => o.id}
                                maxWidth={400}
                                colors={COLORS}
                            />
                        </Box>
                    </Box>

                    {/* ЗАБЕЛЕШКА */}
                    <Box sx={{mb: 2}}>
                        <Label color={COLORS.labelColor}>Забелешка:</Label>
                        <TextField fullWidth multiline rows={3}
                                   value={form.zabeleska}
                                   onChange={(e) => handleChange('zabeleska', e.target.value)}
                                   sx={{mt: 0.5, bgcolor: '#fff'}}/>
                    </Box>

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* СКЕНИРАНИ ДОКУМЕНТИ */}
                    <Box sx={{mb: 2}}>
                        <Typography sx={{
                            color: COLORS.labelColor, fontWeight: 'bold',
                            fontSize: '0.9rem', textDecoration: 'underline',
                            fontStyle: 'italic', display: 'block', mb: 1
                        }}>
                            Скенирани документи:
                        </Typography>
                        {attachedFiles.length > 0 && (
                            <Box sx={{mb: 1}}>
                                {attachedFiles.map((file, idx) => (
                                    <Box key={idx} sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 0.5}}>
                                        <AttachFileIcon fontSize="small" sx={{color: COLORS.labelColor}}/>
                                        <Typography sx={{fontSize: '0.85rem'}}>{file.name}</Typography>
                                        <Button size="small" onClick={() => handleRemoveFile(idx)}
                                                sx={{minWidth: 'auto', color: 'error.main', p: 0, ml: 1}}>✕</Button>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        <input type="file" ref={fileInputRef} style={{display: 'none'}}
                               multiple onChange={handleFileAttach}/>
                        <Button variant="outlined" size="small" startIcon={<AttachFileIcon/>}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    borderColor: COLORS.borderColor, color: '#333',
                                    bgcolor: isDobiena ? '#E8D8A0' : '#C8E8C0',
                                    '&:hover': {bgcolor: isDobiena ? '#D4C080' : '#A8D8A0'},
                                    textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem'
                                }}>
                            Прикачи документ
                        </Button>
                    </Box>

                    {error && (
                        <Box sx={{mb: 2, p: 1.5, bgcolor: '#fdecea',
                            border: '1px solid #f44336', borderRadius: '4px'}}>
                            <Typography color="error" variant="body2">{error}</Typography>
                        </Box>
                    )}

                    <Divider sx={{borderColor: COLORS.borderColor, mb: 2}}/>

                    {/* КОПЧИЊА */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <ActionButton onClick={handleSubmit} disabled={loading}
                                          loading={loading} colors={COLORS}>
                                Зачувај
                            </ActionButton>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <ActionButton colors={COLORS}>
                                Одговор{<br/>}испратена пошта
                            </ActionButton>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <ActionButton colors={COLORS}>
                                СД одговор{<br/>}испратена пошта
                            </ActionButton>
                        </Grid>
                        <Grid item xs={12} sm={3}>
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

export default PredmetForm;