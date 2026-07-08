import { useState, useMemo, useRef } from 'react';
import {
    Box, Container, Typography, Grid, TextField,
    FormControl, RadioGroup, FormControlLabel, Radio,
    Button, Chip, OutlinedInput, Select, MenuItem,
    InputLabel, InputAdornment, ListSubheader, Divider
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import dayjs from 'dayjs';
import useDobienaPosta from "../../../hooks/useDobienaPosta.js";
import { useEnums } from "../../../hooks/useEnums.js";
import useIsprakjac from "../../../hooks/useIsprakjac.js";
import useArhiva from "../../../hooks/useArhiva.js";
import useVidPredmetDobieno from "../../../hooks/useVidPredmetDobieno.js";
import useUsersOdgovornoLice from "../../../hooks/useUsersOdgovornoLice.js";

const COLORS = {
    gold: '#C1A460',
    headerBg: '#E8C97A',
    sectionBg: '#FAE8B0',
    labelColor: '#8B4513',
    borderColor: '#C8A050',
    buttonBg: '#D4A843',
};

const MENU_PROPS = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    PaperProps: { sx: { maxHeight: 320 } }
};

const Label = ({ children, required }) => (
    <Typography
        component="span"
        sx={{ color: COLORS.labelColor, fontWeight: 'bold', fontSize: '0.9rem' }}
    >
        {children}{required && ' *'}
    </Typography>
);

const FieldRow = ({ label, children, required }) => (
    <Grid container spacing={1} alignItems="flex-start" sx={{ mb: 1.5 }}>
        <Grid item xs={12} sm={3} sx={{ pt: '10px !important' }}>
            <Label required={required}>{label}:</Label>
        </Grid>
        <Grid item xs={12} sm={9}>
            {children}
        </Grid>
    </Grid>
);

// Single select со search и limit 10
const SearchableSingleSelect = ({ label, value, onChange, options, getLabel, getId, minWidth = 350 }) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const list = search
            ? options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase()))
            : options;
        return list.slice(0, 10);
    }, [search, options, getLabel]);

    const totalMatches = useMemo(() => {
        if (!search) return options.length;
        return options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase())).length;
    }, [search, options, getLabel]);

    return (
        <FormControl size="small" sx={{ minWidth, bgcolor: '#fff' }}>
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onClose={() => setSearch('')}
                MenuProps={{ ...MENU_PROPS, autoFocus: false }}
            >
                <ListSubheader sx={{ p: 1, bgcolor: '#fff' }}>
                    <TextField
                        size="small" fullWidth placeholder="Пребарај..."
                        autoFocus value={search}
                        onChange={(e) => { e.stopPropagation(); setSearch(e.target.value); }}
                        onKeyDown={(e) => e.stopPropagation()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                    />
                </ListSubheader>
                <ListSubheader sx={{ py: 0.3, bgcolor: '#f9f3e3', lineHeight: '1.8' }}>
                    <Typography variant="caption" color="text.secondary">
                        {filtered.length === 0
                            ? 'Нема резултати'
                            : `Прикажани ${filtered.length} од ${totalMatches}`
                        }
                    </Typography>
                </ListSubheader>
                <MenuItem value=""><em>— Избери —</em></MenuItem>
                {filtered.map(o => (
                    <MenuItem key={getId(o)} value={getId(o)}>{getLabel(o)}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

// Multi select со search и limit 10
const SearchableMultiSelect = ({ label, value, onChange, options, getLabel, getId, maxWidth }) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const list = search
            ? options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase()))
            : options;
        return list.slice(0, 10);
    }, [search, options, getLabel]);

    const totalMatches = useMemo(() => {
        if (!search) return options.length;
        return options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase())).length;
    }, [search, options, getLabel]);

    return (
        <FormControl fullWidth size="small" sx={maxWidth ? { maxWidth } : {}}>
            <InputLabel>{label}</InputLabel>
            <Select
                multiple label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onClose={() => setSearch('')}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map(id => {
                            const item = options.find(o => getId(o) === id);
                            return (
                                <Chip
                                    key={id}
                                    label={item ? getLabel(item) : id}
                                    size="small"
                                    sx={{ bgcolor: '#E8D8A0', fontSize: '0.75rem' }}
                                />
                            );
                        })}
                    </Box>
                )}
                MenuProps={{ ...MENU_PROPS, autoFocus: false }}
            >
                <ListSubheader sx={{ p: 1, bgcolor: '#fff' }}>
                    <TextField
                        size="small" fullWidth placeholder="Пребарај..."
                        autoFocus value={search}
                        onChange={(e) => { e.stopPropagation(); setSearch(e.target.value); }}
                        onKeyDown={(e) => e.stopPropagation()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                    />
                </ListSubheader>
                <ListSubheader sx={{ py: 0.3, bgcolor: '#f9f3e3', lineHeight: '1.8' }}>
                    <Typography variant="caption" color="text.secondary">
                        {filtered.length === 0
                            ? 'Нема резултати'
                            : `Прикажани ${filtered.length} од ${totalMatches}`
                        }
                    </Typography>
                </ListSubheader>
                {filtered.map(o => (
                    <MenuItem key={getId(o)} value={getId(o)}>{getLabel(o)}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const ActionButton = ({ children, onClick, disabled, loading }) => (
    <Button
        fullWidth variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{
            bgcolor: COLORS.buttonBg, color: '#fff',
            fontWeight: 'bold', fontSize: '0.8rem',
            '&:hover': { bgcolor: '#B88A30' },
            textTransform: 'none', py: 1,
            lineHeight: 1.4
        }}
    >
        {loading ? 'Се зачувува...' : children}
    </Button>
);

const DobienaPostaForm = () => {
    const today = dayjs();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        datumZaveduvanje: today,
        tipPosta: "писмо",
        prioritet: "Нормален",
        isprakjacId: "",
        brAktNivni: "",
        datumIsprakjanje: null,
        brAktArhivski: "",
        vidPredmetDobienaId: [],
        sodrzina: "",
        odgovornoLiceId: [],
        informativnaPosta: false,
        realizirano: false,
        arhivaId: [],
        zabeleska: "",
        statusPredmet: ""
    });

    const [attachedFiles, setAttachedFiles] = useState([]);

    const { prioritet, tipPosta,statusPredmet } = useEnums();
    console.log(statusPredmet)
    const { createDobienaPosta, loading, error } = useDobienaPosta();
    const { isprakjaci } = useIsprakjac();
    const { arhiva } = useArhiva();
    const { vidPredmetD } = useVidPredmetDobieno();
    const { odgovornoLice } = useUsersOdgovornoLice();

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleFileAttach = (e) => {
        const files = Array.from(e.target.files);
        setAttachedFiles(prev => [...prev, ...files]);
    };

    const handleRemoveFile = (index) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };
    const handleSubmit = async () => {
        const payload = {
            ...form,
            datumZaveduvanje: form.datumZaveduvanje?.format('YYYY-MM-DD'),
            datumIsprakjanje: form.datumIsprakjanje?.format('YYYY-MM-DD') || null,
            isprakjacId: Number(form.isprakjacId),
        };
        console.log("PAYLOAD:", JSON.stringify(payload, null, 2)); // ← додај
        try {
            await createDobienaPosta(payload);
        } catch (e) {
            console.error("BACKEND ERROR:", e.response?.data); // ← додај
        }
    };

    const selectedIsprakjac = isprakjaci?.find(i => i.id === form.isprakjacId);
    const selectedVidPredmet = (vidPredmetD || []).filter(v => form.vidPredmetDobienaId.includes(v.id));
    const selectedOdgovornoLice = (odgovornoLice || []).filter(u => form.odgovornoLiceId.includes(u.id));
    const selectedArhiva = (arhiva || []).filter(a => form.arhivaId.includes(a.id));

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="md" sx={{ py: 2 }}>

                {/* НАСЛОВ */}
                <Box sx={{
                    bgcolor: COLORS.headerBg,
                    border: `2px solid ${COLORS.borderColor}`,
                    borderRadius: '4px',
                    textAlign: 'center',
                    py: 0.8, mb: 2
                }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#5A3000' }}>
                        Деловодник на добиена пошта за {today.year()} година
                    </Typography>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                    <Label>Статус на предмет:</Label>
                    <FormControl size="small" sx={{ mt: 0.5, minWidth: 350, bgcolor: '#fff' }}>
                        <InputLabel>Избери статус</InputLabel>
                        <Select
                            label="Избери статус"
                            value={form.statusPredmet}
                            onChange={(e) => handleChange('statusPredmet', e.target.value)}
                            MenuProps={MENU_PROPS}
                        >
                            <MenuItem value=""><em>— Избери —</em></MenuItem>
                            {statusPredmet.map(s => (
                                <MenuItem key={s} value={s}>{s}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* ГЛАВНА ФОРМА */}
                <Box sx={{
                    bgcolor: COLORS.sectionBg,
                    border: `1px solid ${COLORS.borderColor}`,
                    borderRadius: '4px',
                    p: 2.5
                }}>

                    {/* БР. НА АКТ + ДАТУМ */}
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Label>Број на актот:</Label>
                                <Box sx={{
                                    bgcolor: '#fff', border: `1px solid ${COLORS.borderColor}`,
                                    borderRadius: '3px', px: 1.5, py: 0.3
                                }}>
                                    <Typography sx={{ fontWeight: 'bold', color: '#333', fontSize: '0.95rem' }}>
                                        11.1
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 'bold' }}>-</Typography>
                                <Box sx={{
                                    bgcolor: '#C8E0FF', border: `1px solid ${COLORS.borderColor}`,
                                    borderRadius: '3px', px: 1.5, py: 0.3
                                }}>
                                    <Typography sx={{ fontWeight: 'bold', color: '#003080' }}>авто</Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 'bold' }}>/</Typography>
                                <Box sx={{
                                    bgcolor: '#C8E0FF', border: `1px solid ${COLORS.borderColor}`,
                                    borderRadius: '3px', px: 1.5, py: 0.3
                                }}>
                                    <Typography sx={{ fontWeight: 'bold', color: '#003080' }}>1</Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 'bold', color: '#333' }}>{today.year()} год.</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Label required>Датум на заведување:</Label>
                                <DatePicker
                                    value={form.datumZaveduvanje}
                                    onChange={(val) => handleChange('datumZaveduvanje', val)}
                                    slotProps={{
                                        textField: { size: 'small', sx: { bgcolor: '#fff', width: 160 } }
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: COLORS.borderColor, mb: 2 }} />

                    {/* ТИП + ПРИОРИТЕТ */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Label required>Тип на добиена пошта:</Label>
                                <Box sx={{
                                    border: `1px solid ${COLORS.borderColor}`,
                                    borderRadius: '3px', bgcolor: '#fff', px: 1.5, py: 0.5
                                }}>
                                    <RadioGroup
                                        value={form.tipPosta}
                                        onChange={(e) => handleChange('tipPosta', e.target.value)}
                                    >
                                        {(tipPosta.length > 0 ? tipPosta : ['писмо', 'телеграма']).map(t => (
                                            <FormControlLabel
                                                key={t} value={t}
                                                control={<Radio size="small" sx={{ py: 0.2 }} />}
                                                label={<Typography sx={{ fontSize: '0.85rem' }}>{t}</Typography>}
                                                sx={{ m: 0 }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Label required>Приоритет:</Label>
                                <Box sx={{
                                    border: `1px solid ${COLORS.borderColor}`,
                                    borderRadius: '3px', bgcolor: '#fff', px: 1.5, py: 0.5
                                }}>
                                    <RadioGroup
                                        value={form.prioritet}
                                        onChange={(e) => handleChange('prioritet', e.target.value)}
                                    >
                                        {(prioritet.length > 0 ? prioritet : ['Висок', 'Нормален']).map(p => (
                                            <FormControlLabel
                                                key={p} value={p}
                                                control={<Radio size="small" sx={{ py: 0.2 }} />}
                                                label={<Typography sx={{ fontSize: '0.85rem' }}>{p}</Typography>}
                                                sx={{ m: 0 }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: COLORS.borderColor, mb: 2 }} />

                    {/* ИСПРАЌАЧ */}
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Label required>Испраќач:</Label>
                            {selectedIsprakjac && (
                                <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {selectedIsprakjac.naziv}
                                </Typography>
                            )}
                        </Box>
                        <SearchableSingleSelect
                            label="Избери испраќач"
                            value={form.isprakjacId}
                            onChange={(val) => handleChange('isprakjacId', val)}
                            options={isprakjaci || []}
                            getLabel={(o) => o.naziv}
                            getId={(o) => o.id}
                            minWidth={400}
                        />
                    </Box>

                    {/* БР. АКТ НИВНИ + ДАТУМ + АРХИВСКИ */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <Label>Број на акт (нивни):</Label>
                            <TextField
                                fullWidth size="small"
                                placeholder="пр. 12.1.1-924/2-25"
                                value={form.brAktNivni}
                                onChange={(e) => handleChange('brAktNivni', e.target.value)}
                                sx={{ mt: 0.5, bgcolor: '#fff' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Label>Датум на испраќање:</Label>
                            <DatePicker
                                value={form.datumIsprakjanje}
                                onChange={(val) => handleChange('datumIsprakjanje', val)}
                                slotProps={{
                                    textField: { size: 'small', fullWidth: true, sx: { mt: 0.5, bgcolor: '#fff' } }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Label>Број на акт (архивски):</Label>
                            <TextField
                                fullWidth size="small"
                                value={form.brAktArhivski}
                                onChange={(e) => handleChange('brAktArhivski', e.target.value)}
                                sx={{ mt: 0.5, bgcolor: '#fff' }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: COLORS.borderColor, mb: 2 }} />

                    {/* ВИД НА ПРЕДМЕТ */}
                    <Box sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Label required>Вид на предмет:</Label>
                            {selectedVidPredmet.length > 0 && (
                                <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {selectedVidPredmet.map(v => v.naziv).join(', ')}
                                </Typography>
                            )}
                        </Box>
                        <SearchableMultiSelect
                            label="Избери вид"
                            value={form.vidPredmetDobienaId}
                            onChange={(val) => handleChange('vidPredmetDobienaId', val)}
                            options={vidPredmetD || []}
                            getLabel={(o) => o.naziv}
                            getId={(o) => o.id}
                            maxWidth={450}
                        />
                    </Box>

                    {/* СОДРЖИНА */}
                    <Box sx={{ mb: 2 }}>
                        <Label required>Содржина:</Label>
                        <TextField
                            fullWidth multiline rows={4}
                            placeholder="Кратка содржина на предметот..."
                            value={form.sodrzina}
                            onChange={(e) => handleChange('sodrzina', e.target.value)}
                            sx={{ mt: 0.5, bgcolor: '#fff' }}
                        />
                    </Box>

                    <Divider sx={{ borderColor: COLORS.borderColor, mb: 2 }} />

                    {/* ОДГОВОРНО ЛИЦЕ */}
                    <Box sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Label>Одговорно лице:</Label>
                            {selectedOdgovornoLice.length > 0 && (
                                <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {selectedOdgovornoLice.map(u => `${u.ime} ${u.prezime}`).join(', ')}
                                </Typography>
                            )}
                        </Box>
                        <SearchableMultiSelect
                            label="Избери одговорно лице"
                            value={form.odgovornoLiceId}
                            onChange={(val) => handleChange('odgovornoLiceId', val)}
                            options={odgovornoLice || []}
                            getLabel={(o) => `${o.ime} ${o.prezime} — ${o.uloga}`}
                            getId={(o) => o.id}
                            maxWidth={550}
                        />
                    </Box>

                    {/* ИНФОРМАТИВНА ПОШТА */}
                    <FieldRow label="Информативна пошта">
                        <RadioGroup
                            row
                            value={form.informativnaPosta ? "da" : "ne"}
                            onChange={(e) => handleChange('informativnaPosta', e.target.value === 'da')}
                        >
                            <FormControlLabel value="da" control={<Radio size="small" />}
                                              label={<Typography sx={{ fontSize: '0.85rem' }}>Да</Typography>} />
                            <FormControlLabel value="ne" control={<Radio size="small" />}
                                              label={<Typography sx={{ fontSize: '0.85rem' }}>Не</Typography>} />
                        </RadioGroup>
                    </FieldRow>

                    {/* РЕАЛИЗИРАНО */}
                    <FieldRow label="Реализирано">
                        <RadioGroup
                            row
                            value={form.realizirano ? "da" : "ne"}
                            onChange={(e) => handleChange('realizirano', e.target.value === 'da')}
                        >
                            <FormControlLabel value="da" control={<Radio size="small" />}
                                              label={<Typography sx={{ fontSize: '0.85rem' }}>Да</Typography>} />
                            <FormControlLabel value="ne" control={<Radio size="small" />}
                                              label={<Typography sx={{ fontSize: '0.85rem' }}>Не</Typography>} />
                        </RadioGroup>
                    </FieldRow>

                    {/* АРХИВА */}
                    <Box sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Label>Архива:</Label>
                            {selectedArhiva.length > 0 && (
                                <Typography sx={{ fontWeight: 'bold', color: COLORS.labelColor }}>
                                    {selectedArhiva.map(a => a.naziv).join(', ')}
                                </Typography>
                            )}
                        </Box>
                        <SearchableMultiSelect
                            label="Избери архива"
                            value={form.arhivaId}
                            onChange={(val) => handleChange('arhivaId', val)}
                            options={arhiva || []}
                            getLabel={(o) => o.naziv}
                            getId={(o) => o.id}
                            maxWidth={400}
                        />
                    </Box>

                    {/* ЗАБЕЛЕШКА */}
                    <Box sx={{ mb: 2 }}>
                        <Label>Забелешка:</Label>
                        <TextField
                            fullWidth multiline rows={3}
                            value={form.zabeleska}
                            onChange={(e) => handleChange('zabeleska', e.target.value)}
                            sx={{ mt: 0.5, bgcolor: '#fff' }}
                        />
                    </Box>

                    <Divider sx={{ borderColor: COLORS.borderColor, mb: 2 }} />

                    {/* СКЕНИРАНИ ДОКУМЕНТИ */}
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{
                            color: COLORS.labelColor, fontWeight: 'bold',
                            fontSize: '0.9rem', textDecoration: 'underline',
                            fontStyle: 'italic', display: 'block', mb: 1
                        }}>
                            Скенирани документи:
                        </Typography>

                        {attachedFiles.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                                {attachedFiles.map((file, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <AttachFileIcon fontSize="small" sx={{ color: COLORS.labelColor }} />
                                        <Typography sx={{ fontSize: '0.85rem' }}>{file.name}</Typography>
                                        <Button
                                            size="small"
                                            onClick={() => handleRemoveFile(idx)}
                                            sx={{ minWidth: 'auto', color: 'error.main', p: 0, ml: 1 }}
                                        >
                                            ✕
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            multiple
                            onChange={handleFileAttach}
                        />
                        <Button
                            variant="outlined" size="small"
                            startIcon={<AttachFileIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                borderColor: COLORS.borderColor, color: '#333',
                                bgcolor: '#E8D8A0', '&:hover': { bgcolor: '#D4C080' },
                                textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem'
                            }}
                        >
                            Прикачи документ
                        </Button>
                    </Box>

                    {error && (
                        <Box sx={{ mb: 2, p: 1.5, bgcolor: '#fdecea', border: '1px solid #f44336', borderRadius: '4px' }}>
                            <Typography color="error" variant="body2">{error}</Typography>
                        </Box>
                    )}

                    <Divider sx={{ borderColor: COLORS.borderColor, mb: 2 }} />

                    {/* КОПЧИЊА */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <ActionButton onClick={handleSubmit} disabled={loading} loading={loading}>
                                Зачувај
                            </ActionButton>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <ActionButton>
                                Одговор{<br />}испратена пошта
                            </ActionButton>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <ActionButton>
                                СД одговор{<br />}испратена пошта
                            </ActionButton>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <ActionButton>
                                Одговор{<br />}добиена пошта
                            </ActionButton>
                        </Grid>
                    </Grid>

                </Box>
            </Container>
        </LocalizationProvider>
    );
};

export default DobienaPostaForm;