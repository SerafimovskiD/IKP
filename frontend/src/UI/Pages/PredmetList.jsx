// src/pages/PredmetiList.jsx
import {useState, useEffect, useCallback, useMemo} from 'react';
import {
    Box, Typography, Grid, TextField,
    Button, Chip, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Paper, Pagination, FormControl,
    Select, MenuItem, InputAdornment, IconButton,
    Tooltip, ListSubheader
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import InboxIcon from '@mui/icons-material/Inbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { predmetiApi } from '../../api/predmeti.js';
import useIsprakjac from '../../hooks/useIsprakjac.js';
import useUsersOdgovornoLice from '../../hooks/useUsersOdgovornoLice.js';
import useVidPredmetDobieno from '../../hooks/useVidPredmetDobieno.js';
import useVidPredmetIspratena from '../../hooks/useVidPredmetIspratena.js';
import {useEnums} from "../../hooks/useEnums.js";
import useArhiva from "../../hooks/useArhiva.js";

const THEME = {
    gradient: 'linear-gradient(135deg, #6B0D1E 0%, #9B1D2E 60%, #C8404A 100%)',
    accent: '#9B1D2E',
    accentLight: '#FFF0F0',
    border: '#E8C8C8',
};

const StatusChip = ({status}) => {
    const color = status?.includes('архив') ? '#388E3C'
        : status?.includes('потпиш') ? '#1565C0'
            : status?.includes('чека') ? '#E65100'
                : '#666';
    return (
        <Chip label={status || '—'} size="small"
              sx={{bgcolor: color + '18', color, fontSize: '0.65rem',
                  fontWeight: 600, height: 20, maxWidth: 180}}
        />
    );
};

const TipBadge = ({tip}) => {
    const isDobiena = tip === 'Dobiena';
    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.4}}>
            {isDobiena
                ? <InboxIcon sx={{fontSize: 13, color: '#C8A84B'}}/>
                : <OutboxIcon sx={{fontSize: 13, color: '#388E3C'}}/>
            }
            <Typography sx={{fontSize: '0.72rem', color: isDobiena ? '#8B6914' : '#1B5E20', fontWeight: 600}}>
                {isDobiena ? 'Добиена' : 'Испратена'}
            </Typography>
        </Box>
    );
};
const ColFilter = ({value, onChange, placeholder = '...'}) => (
    <TextField
        size="small" fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
            input: {
                endAdornment: value && (
                    <InputAdornment position="end">
                        {/*<IconButton size="small" onClick={(e) => { e.stopPropagation(); onChange(''); }}>*/}
                        {/*    <ClearIcon sx={{fontSize: 15}}/>*/}
                        {/*</IconButton>*/}
                    </InputAdornment>
                )
            }
        }}
        sx={{
            '& .MuiOutlinedInput-root': {
                fontSize: '0.72rem',
                bgcolor: '#fff',
                '& input': {py: 0.5, px: 0.8}
            },
            '& .MuiOutlinedInput-notchedOutline': {borderColor: '#E0E0E0'}
        }}
    />
);
// Надвор од компонентата — ColFilter останува ист

const ColRadio = ({value, onChange, options}) => {
    console.log("value:", JSON.stringify(value), "options:", options.map(o => JSON.stringify(o.value)));
    return(
        <Box sx={{display: 'flex', gap: 0.3, flexWrap: 'nowrap'}}>
            <Box
                onClick={() => onChange(value === '' ? '' : '')}
                sx={{
                    fontSize: '0.65rem', px: 0.6, py: 0.3,
                    borderRadius: '4px', cursor: 'pointer',
                    bgcolor: value === '' ? '#E0E0E0' : 'transparent',
                    color: '#666', border: '1px solid #E0E0E0',
                    '&:hover': {bgcolor: '#F0F0F0'}
                }}
                onClick={() => onChange('')}
            >
                Сите
            </Box>
            {options.map(opt => (
                <Box key={opt.value}
                     onClick={() => onChange(value === opt.value ? '' : opt.value)}
                     sx={{
                         fontSize: '0.65rem', px: 0.6, py: 0.3,
                         borderRadius: '4px', cursor: 'pointer',
                         bgcolor: value === opt.value ? '#7B0D1E' : 'transparent',
                         color: value === opt.value ? '#fff' : '#666',
                         border: `1px solid ${value === opt.value ? '#7B0D1E' : '#E0E0E0'}`,
                         '&:hover': {bgcolor: value === opt.value ? '#7B0D1E' : '#F0F0F0'}
                     }}
                >
                    {opt.label}
                </Box>
            ))}
        </Box>
    )
};

const ColDropdown = ({value, onChange, options, getLabel, getId, placeholder}) => {
    const [search, setSearch] = useState('');
    const filtered = useMemo(() => {
        if (!search) return options;
        return options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase()));
    }, [search, options, getLabel]);

    return (
        <FormControl size="small" fullWidth>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onClose={() => setSearch('')}
                displayEmpty
                renderValue={(v) => {
                    if (!v) return <Typography sx={{fontSize: '0.7rem', color: '#999'}}>{placeholder}</Typography>;
                    const item = options.find(o => getId(o) === v);
                    return <Typography sx={{fontSize: '0.7rem'}}>{item ? getLabel(item) : v}</Typography>;
                }}
                MenuProps={{
                    anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
                    transformOrigin: {vertical: 'top', horizontal: 'left'},
                    autoFocus: false,
                    slotProps: {paper: {sx: {maxHeight: 280}}}
                }}
                sx={{
                    '& .MuiSelect-select': {py: 0.5, px: 0.8, fontSize: '0.7rem'},
                    bgcolor: '#fff'
                }}
            >
                <ListSubheader sx={{p: 0.8, bgcolor: '#fff'}}>
                    <TextField
                        size="small" fullWidth placeholder="Пребарај..."
                        autoFocus value={search}
                        onChange={(e) => {e.stopPropagation(); setSearch(e.target.value);}}
                        onKeyDown={(e) => e.stopPropagation()}
                        sx={{'& .MuiOutlinedInput-root': {fontSize: '0.7rem'}}}
                        InputProps={{startAdornment: <InputAdornment position="start"><SearchIcon sx={{fontSize: 13}}/></InputAdornment>}}
                    />
                </ListSubheader>
                <MenuItem value="" sx={{fontSize: '0.78rem', color: '#999'}}>
                    <em>Сите</em>
                </MenuItem>
                {filtered.map(o => (
                    <MenuItem key={getId(o)} value={getId(o)} sx={{fontSize: '0.78rem'}}>
                        {getLabel(o)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
const PredmetiList = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        godina: '',
        redenBroj: '',
        datumZaveduvanje: '',
        brAktNivni: '',
        sodrzina: '',
        zabeleska: '',
        isprakjacId: '',
        odgovornoLiceId: '',
        vidPredmetDobienaId: '',
        vidPredmetIspratenaId: '',
        realizirano: '',
        tipDelovnik: '',
        tipPosta: '',
        statusPredmet: '',
        arhivaId: '',
    });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    useEffect(() => {
        console.log("filters changed:", filters);
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
            setPage(0);
        }, 1000);
        return () => clearTimeout(timer);
    }, [filters]);

    const [page, setPage] = useState(0);
    const [sort, setSort] = useState({field: 'datumZaveduvanje', dir: 'desc'});
    const {isprakjaci} = useIsprakjac();
    const {odgovornoLice} = useUsersOdgovornoLice();
    const {vidPredmetD} = useVidPredmetDobieno();
    const {vidPredmetI} = useVidPredmetIspratena();
    const {arhiva} = useArhiva();
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', 50);
            // params.append('sort', 'datumZaveduvanje,desc');
            params.append('sort', `${sort.field},${sort.dir}`);

            if (debouncedFilters.search) params.append('search', debouncedFilters.search);
            if (debouncedFilters.godina) params.append('godina', debouncedFilters.godina);
            if (debouncedFilters.datumZaveduvanje) params.append('datumZaveduvanje', debouncedFilters.datumZaveduvanje);
            if (debouncedFilters.redenBroj) params.append('redenBroj', debouncedFilters.redenBroj);
            if (debouncedFilters.brAktNivni) params.append('brAktNivni', debouncedFilters.brAktNivni);
            if (debouncedFilters.sodrzina) params.append('sodrzina', debouncedFilters.sodrzina);
            if (debouncedFilters.zabeleska) params.append('zabeleska', debouncedFilters.zabeleska);
            if (debouncedFilters.isprakjacId) params.append('isprakjacId', debouncedFilters.isprakjacId);
            if (debouncedFilters.odgovornoLiceId) params.append('odgovornoLiceId', debouncedFilters.odgovornoLiceId);
            if (debouncedFilters.vidPredmetDobienaId) params.append('vidPredmetDobienaId', debouncedFilters.vidPredmetDobienaId);
            if (debouncedFilters.vidPredmetIspratenaId) params.append('vidPredmetIspratenaId', debouncedFilters.vidPredmetIspratenaId);
            if (debouncedFilters.realizirano !== '') params.append('realizirano', debouncedFilters.realizirano);
            if (debouncedFilters.tipDelovnik) params.append('tipDelovnik', debouncedFilters.tipDelovnik);
            if (debouncedFilters.tipPosta) params.append('tipPosta', debouncedFilters.tipPosta);
            if (debouncedFilters.statusPredmet) params.append('statusPredmet', debouncedFilters.statusPredmet);
            if (debouncedFilters.arhivaId) params.append('arhivaId', debouncedFilters.arhivaId);

            const res = await predmetiApi.getAll(Object.fromEntries(params));
            setData(res);
        } catch (e) {
            setError('Грешка при вчитување');
        } finally {
            setLoading(false);
        }
    }, [debouncedFilters, page,sort]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const hf = (field, value) => {
        setFilters(p => ({...p, [field]: value}));
        setPage(0);
    };

    const {statusPredmet} = useEnums();
    const clearFilters = () => {
        const empty = {
            search: '', godina: '', redenBroj: '', datumZaveduvanje: '',
            brAktNivni: '', sodrzina: '', zabeleska: '',
            isprakjacId: '', odgovornoLiceId: '',
            vidPredmetDobienaId: '', vidPredmetIspratenaId: '',
            realizirano: '', tipDelovnik: '', tipPosta: '',
            statusPredmet: '', arhivaId: ''
        };
        setFilters(empty);
        setDebouncedFilters(empty);
        setPage(0);
    };
    console.log(data?.content?.[0]?.tipPosta);
    const hasActiveFilters = Object.values(filters).some(v => v !== '');
    console.log(data)



    const SortIcon = ({field, sort}) => {
        if (sort.field !== field) return <UnfoldMoreIcon sx={{fontSize: 13, color: '#CCC'}}/>;
        return sort.dir === 'asc'
            ? <ArrowUpwardIcon sx={{fontSize: 13, color: '#7B0D1E'}}/>
            : <ArrowDownwardIcon sx={{fontSize: 13, color: '#7B0D1E'}}/>;
    };

    const handleSort = (field) => {
        setSort(prev => ({
            field,
            dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc'
        }));
        setPage(0);
    };


    return (
        <Box sx={{bgcolor: '#F2F4F7', minHeight: '100vh', py: 2.5, px: 2.5}}>

                {/* HEADER */}
                <Box sx={{
                    background: THEME.gradient,
                    borderRadius: '10px 10px 0 0',
                    px: 3, py: 1.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Box>
                        <Typography sx={{color: 'rgba(255,255,255,0.65)', fontSize: '0.62rem',
                            fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.2}}>
                            Интерна книга на пошта
                        </Typography>
                        <Typography sx={{color: '#fff', fontWeight: 700, fontSize: '1rem'}}>
                            Листа на предмети
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        {data && (
                            <Box sx={{bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px', px: 2, py: 0.8}}>
                                <Typography sx={{color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem', mb: 0.1}}>
                                    ВКУПНО ЗАПИСИ
                                </Typography>
                                <Typography sx={{color: '#fff', fontWeight: 700, fontSize: '0.95rem'}}>
                                    {data.page.totalElements?.toLocaleString()}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                <Box sx={{border: '1px solid #E0E3E8', borderTop: 'none',
                    borderRadius: '0 0 10px 10px', bgcolor: '#F8F9FB', p: 2.5}}>

                    {/* SEARCH BAR */}
                    <Box sx={{display: 'flex', gap: 1.5, mb: 2, alignItems: 'center'}}>
                        <TextField
                            fullWidth size="small"
                            placeholder="Пребарај по содржина, број на акт..."
                            value={filters.search}
                            onChange={(e) => hf('search', e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{fontSize: 18, color: '#999'}}/>
                                    </InputAdornment>
                                ),
                                endAdornment: filters.search && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => hf('search', '')}>
                                            <ClearIcon sx={{fontSize: 15}}/>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{'& .MuiOutlinedInput-root': {bgcolor: '#fff'}}}
                        />
                        <Tooltip title="Филтри">
                            <Button
                                variant={showFilters ? 'contained' : 'outlined'}
                                startIcon={<FilterListIcon sx={{fontSize: 16}}/>}
                                onClick={() => setShowFilters(p => !p)}
                                sx={{
                                    whiteSpace: 'nowrap', px: 2,
                                    bgcolor: showFilters ? THEME.accent : '#fff',
                                    borderColor: showFilters ? THEME.accent : '#D8D8D8',
                                    color: showFilters ? '#fff' : '#666',
                                    '&:hover': {bgcolor: showFilters ? '#7B0D1E' : '#F5F5F5'},
                                    textTransform: 'none', fontSize: '0.82rem'
                                }}
                            >
                                Филтри {hasActiveFilters && `(${Object.values(filters).filter(v => v !== '').length})`}
                            </Button>
                        </Tooltip>
                        {hasActiveFilters && (
                            <Tooltip title="Исчисти филтри">
                                <IconButton size="small" onClick={clearFilters}
                                            sx={{bgcolor: '#fff', border: '1px solid #E0E0E0'}}>
                                    <ClearIcon sx={{fontSize: 16}}/>
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>

                    {/* FILTERS PANEL */}
                    {showFilters && (
                        <Box sx={{
                            bgcolor: '#fff', border: '1px solid #E8E8E8',
                            borderRadius: '8px', p: 2, mb: 2
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField fullWidth size="small" label="Година"
                                               type="number"
                                               value={filters.godina}
                                               onChange={(e) => hf('godina', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* TABLE */}
                    {loading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', py: 6}}>
                            <CircularProgress sx={{color: THEME.accent}}/>
                        </Box>
                    ) : error ? (
                        <Box sx={{p: 3, textAlign: 'center'}}>
                            <Typography color="error">{error}</Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0}
                                        sx={{border: '1px solid #E8E8E8', borderRadius: '8px',
                                            overflow: 'hidden', overflowX: 'auto'}}>
                            <Table size="small" sx={{minWidth: 1400}}>
                                <TableHead>
                                    {/* РЕД 1 — Наслови */}
                                    <TableRow sx={{bgcolor: '#F5F6FA'}}>
                                        {[ {label: 'Наш Број', field: 'redenBroj'},
                                            {label: 'Вид пошта', field: null},
                                            {label: 'Тип пошта', field: null},
                                            {label: 'Датум заведување', field: 'datumZaveduvanje'},
                                            {label: 'Број акт (нивни)', field: null},
                                            {label: 'Испраќач', field: null},
                                            {label: 'Одговорно лице', field: null},
                                            {label: 'Предмет', field: null},
                                            {label: 'Содржина', field: null},
                                            {label: 'Реализ.', field: null},
                                            {label: 'Архива', field: null},
                                            {label: 'Забелешка', field: null},
                                            {label: 'Статус', field: null},].map(({label, field}) => (
                                            <TableCell key={label}
                                                       onClick={() => field && handleSort(field)}
                                                       sx={{
                                                           fontSize: '0.68rem', fontWeight: 700,
                                                           color: sort.field === field ? '#7B0D1E' : '#888',
                                                           letterSpacing: '0.08em', textTransform: 'uppercase',
                                                           py: 1, borderBottom: '1px solid #E8E8E8',
                                                           cursor: field ? 'pointer' : 'default',
                                                           whiteSpace: 'nowrap',
                                                           userSelect: 'none',
                                                           '&:hover': field ? {bgcolor: '#F0F0F0', color: '#7B0D1E'} : {}
                                                       }}
                                            >
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.3}}>
                                                    {label}
                                                    {field && <SortIcon field={field} sort={sort}/>}
                                                </Box>
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                    {/* РЕД 2 — Column filters */}
                                    <TableRow sx={{bgcolor: '#FAFAFA', borderBottom: '2px solid #E8E8E8'}}>

                                        {/* Реден број */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColFilter value={filters.redenBroj}
                                                       onChange={(v) => hf('redenBroj', v)} placeholder="Број..."/>
                                        </TableCell>

                                        {/* Вид пошта — радио ДП/ИП */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColRadio
                                                value={filters.tipDelovnik}
                                                onChange={(v) => hf('tipDelovnik', v)}
                                                options={[
                                                    {label: 'ДП', value: 'Dobiena'},
                                                    {label: 'ИП', value: 'Ispratena'},
                                                ]}
                                            />
                                        </TableCell>

                                        {/* Тип пошта — радио П/Т */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColRadio
                                                value={filters.tipPosta}
                                                onChange={(v) => hf('tipPosta', v)}
                                                options={[
                                                    {label: 'П', value: 'писмо'},
                                                    {label: 'Т', value: 'телеграма'},
                                                ]}
                                            />
                                        </TableCell>

                                        {/* Датум */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColFilter value={filters.datumZaveduvanje}
                                                       onChange={(v) => hf('datumZaveduvanje', v)} placeholder="Датум..."/>
                                        </TableCell>

                                        {/* Бр.акт нивни */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColFilter value={filters.brAktNivni}
                                                       onChange={(v) => hf('brAktNivni', v)} placeholder="Бр.акт..."/>
                                        </TableCell>

                                        {/* Испраќач — dropdown */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColDropdown
                                                value={filters.isprakjacId}
                                                onChange={(v) => hf('isprakjacId', v)}
                                                options={isprakjaci || []}
                                                getLabel={(o) => o.naziv}
                                                getId={(o) => o.id}
                                                placeholder="Испраќач..."
                                            />
                                        </TableCell>

                                        {/* Одговорно лице — dropdown */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColDropdown
                                                value={filters.odgovornoLiceId}
                                                onChange={(v) => hf('odgovornoLiceId', v)}
                                                options={odgovornoLice || []}
                                                getLabel={(o) => `${o.ime} ${o.prezime}`}
                                                getId={(o) => o.id}
                                                placeholder="Лице..."
                                            />
                                        </TableCell>

                                        {/* Вид предмет — dropdown */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColDropdown
                                                value={filters.vidPredmetDobienaId || filters.vidPredmetIspratenaId}
                                                onChange={(v) => {
                                                    // Во зависност од tipDelovnik — испрати во вистинскиот параметар
                                                    if (filters.tipDelovnik === 'Ispratena') {
                                                        hf('vidPredmetIspratenaId', v);
                                                    } else {
                                                        hf('vidPredmetDobienaId', v);
                                                    }
                                                }}
                                                options={filters.tipDelovnik === 'Ispratena'
                                                    ? (vidPredmetI || [])
                                                    : [...(vidPredmetD || []), ...(vidPredmetI || [])]}
                                                getLabel={(o) => o.naziv}
                                                getId={(o) => o.id}
                                                placeholder="Предмет..."
                                            />
                                        </TableCell>

                                        {/* Содржина */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColFilter value={filters.sodrzina}
                                                       onChange={(v) => hf('sodrzina', v)} placeholder="Содржина..."/>
                                        </TableCell>

                                        {/* Реализирано — радио */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColRadio
                                                value={filters.realizirano}
                                                onChange={(v) => hf('realizirano', v)}
                                                options={[
                                                    {label: 'Да', value: 'true'},
                                                    {label: 'Не', value: 'false'},
                                                ]}
                                            />
                                        </TableCell>

                                        {/* Архива */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColDropdown
                                                value={filters.arhivaId}
                                                onChange={(v) => hf('arhivaId', v)}
                                                options={arhiva || []}
                                                getLabel={(o) => `${o.naziv}`}
                                                getId={(o) => o.id}
                                                placeholder="Архива..."
                                            />
                                             </TableCell>

                                        {/* Забелешка */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColFilter value={filters.zabeleska}
                                                       onChange={(v) => hf('zabeleska', v)} placeholder="Забелешка..."/>
                                        </TableCell>

                                        {/* Статус — dropdown */}
                                        <TableCell sx={{py: 0.5, px: 1}}>
                                            <ColDropdown
                                                value={filters.statusPredmet}
                                                onChange={(v) => hf('statusPredmet', v)}
                                                options={statusPredmet?.map(s => ({id: s, naziv: s})) || []}
                                                getLabel={(o) => o.naziv}
                                                getId={(o) => o.id}
                                                placeholder="Статус..."
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {data?.content?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={13} sx={{textAlign: 'center', py: 6}}>
                                                <Typography sx={{color: '#BBB', fontSize: '0.875rem'}}>
                                                    Нема пронајдени предмети
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : data?.content?.map((predmet) => (
                                        <TableRow key={predmet.id}
                                                  sx={{'&:hover': {bgcolor: '#F8F9FB'}, cursor: 'pointer',
                                                      '&:last-child td': {borderBottom: 'none'}}}
                                                  onClick={() => navigate(`/posta/${predmet.id}`)}
                                        >
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.82rem', fontWeight: 600, color: '#333', fontFamily: 'monospace'}}>
                                                    {predmet.redenBroj}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}><TipBadge tip={predmet.tipDelovnik}/></TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#666'}}>
                                                    {predmet.tipPosta}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#666'}}>
                                                    {predmet.datumZaveduvanje}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#666'}}>
                                                    {predmet.brAktNivni || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                    {predmet.isprakjacNaziv || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                    {predmet.odgovornoLiceNaziv?.join(', ') || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                    {predmet.vidPredmetNaziv?.join('/') || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 200, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                    {predmet.sodrzina || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 200, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                    {predmet.realizirano ? "Да" : "Не"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                    {predmet.arhivaNaziv?.join(', ') || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                    {predmet.zabeleska || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <StatusChip status={predmet.statusPredmet}/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* PAGINATION */}
                    {data && data.page.totalPages > 1 && (
                        <Box sx={{display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', mt: 2}}>
                            <Typography sx={{fontSize: '0.78rem', color: '#888'}}>
                                Прикажани {data.content.length} од {data.page.totalElements} записи
                            </Typography>
                            <Pagination
                                count={data.page.totalPages}
                                page={page + 1}
                                onChange={(_, val) => setPage(val - 1)}
                                size="small"
                                sx={{
                                    '& .MuiPaginationItem-root': {fontSize: '0.78rem'},
                                    '& .Mui-selected': {bgcolor: `${THEME.accent} !important`, color: '#fff'}
                                }}
                            />
                        </Box>
                    )}
                </Box>
        </Box>
    );
};

export default PredmetiList;