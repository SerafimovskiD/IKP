// src/pages/PredmetiList.jsx
import {useState, useEffect, useCallback, useRef} from 'react';
import {
    Box, Typography, Grid, TextField,
    Button, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Paper, Pagination, FormControl,
    InputAdornment, IconButton,
    Tooltip, Card, CardHeader, CardContent, Divider
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { predmetiApi } from '../../api/predmeti.js';
import useIsprakjac from '../../hooks/useIsprakjac.js';
import useUsersOdgovornoLice from '../../hooks/useUsersOdgovornoLice.js';
import useVidPredmetDobieno from '../../hooks/useVidPredmetDobieno.js';
import useVidPredmetIspratena from '../../hooks/useVidPredmetIspratena.js';
import {useEnums} from "../../hooks/useEnums.js";
import useArhiva from "../../hooks/useArhiva.js";
import {formatStatus} from "../../utils/formatters.js";
import StatusChip from "../../components/common/StatusChip.jsx";
import TipBadge from "../../components/common/TipBadge.jsx";
import ColFilter from "../../components/common/table/ColFilter.jsx";
import ColRadio from "../../components/common/table/ColRadio.jsx";
import ColDropdown from "../../components/common/table/ColDropdown.jsx";

const THEME = {
    gradient: 'linear-gradient(135deg, #6B0D1E 0%, #9B1D2E 60%, #C8404A 100%)',
    accent: '#826f35',
    accentLight: '#FFF0F0',
    border: '#E8C8C8',
};

const PredmetiList = () => {

    const navigate = useNavigate();

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
    const skipDebounceRef = useRef(false);
    useEffect(() => {
        if (skipDebounceRef.current) {
            skipDebounceRef.current = false;
            return;
        }
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
            setPage(0);
        }, 350);
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

    // За dropdown/радио филтри — применува веднаш, без чекање на debounce
    const hfInstant = (field, value) => {
        skipDebounceRef.current = true;
        setFilters(p => {
            const next = {...p, [field]: value};
            setDebouncedFilters(next);
            return next;
        });
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
            ? <ArrowUpwardIcon sx={{fontSize: 13, color: '#55481f'}}/>
            : <ArrowDownwardIcon sx={{fontSize: 13, color: '#55481f'}}/>;
    };

    const handleSort = (field) => {
        setSort(prev => ({
            field,
            dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc'
        }));
        setPage(0);
    };


    return (
        <Box sx={{p: 3}}>

            {/* ── НАСЛОВ (изглед идентичен на DemoApp SectionTitle) ── */}
            <Box sx={{
                background: 'linear-gradient(240deg, #b6a268 0%, #dbbd5e 70%, #826f35 100%)',
                borderRadius: '0% 100% 100% 0% / 50% 50% 50% 50%',
                mb: '5px', px: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Typography variant="h6" sx={{color: '#000'}}>
                    Пребарување — Листа на предмети
                </Typography>
                {/*{data && (*/}
                {/*    <Typography sx={{color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem',mx:20,}}>*/}
                {/*        Вкупно записи: {data.page.totalElements?.toLocaleString()}*/}
                {/*    </Typography>*/}
                {/*)}*/}
            </Box>
            <Divider/>
            <br/>
            {/* ── КАРТИЧКА СО РЕЗУЛТАТИ (изглед идентичен на DemoApp CardWrapperWithStyles) ── */}
            <Card sx={{marginBottom: '3px'}}>
                <CardHeader
                    sx={{
                        maxHeight: '5px',
                        background: 'linear-gradient(240deg, #FFFFFF 0%, #dbbd5e 70%, #A9A085 100%)',
                        borderRadius: '0% 100% 100% 0% / 50% 50% 50% 50%',
                    }}
                    title={
                        <Typography variant="subtitle1" color="#FFFFFF">
                            Резултати
                        </Typography>
                    }
                />
                <CardContent>

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
                                    '&:hover': {bgcolor: showFilters ? '#826f35' : '#F5F5F5'},
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
                                        sx={{
                                            border: '1px solid #E8E8E8', borderRadius: '8px',
                                            overflow: 'hidden', overflowX: 'auto'
                                        }}>
                            <Table size="small" sx={{
                                minWidth: 1400,
                                '& td.MuiTableCell-root, & th.MuiTableCell-root': {
                                    padding: '6px 24px 6px 16px',
                                    fontSize: '12px',
                                },
                                '& th.MuiTableCell-root input': {fontSize: '12px'},
                            }}>
                                <TableHead>
                                    {/* Наслов + филтер заедно во еден ред, златна боја */}
                                    <TableRow sx={{
                                        background: 'linear-gradient(240deg, #b6a268 0%, #dbbd5e 70%, #826f35 100%)',
                                    }}>
                                        {[
                                            {
                                                label: 'Наш Број', field: 'redenBroj',
                                                filter: <ColFilter value={filters.redenBroj}
                                                                   onChange={(v) => hf('redenBroj', v)}
                                                                   placeholder="Број..."/>
                                            },
                                            {
                                                label: 'Вид пошта', field: null,
                                                filter: <ColRadio
                                                    value={filters.tipDelovnik}
                                                    onChange={(v) => hfInstant('tipDelovnik', v)}
                                                    options={[
                                                        {label: 'ДП', value: 'Dobiena'},
                                                        {label: 'ИП', value: 'Ispratena'},
                                                    ]}
                                                />
                                            },
                                            {
                                                label: 'Тип пошта', field: null,
                                                filter: <ColRadio
                                                    value={filters.tipPosta}
                                                    onChange={(v) => hfInstant('tipPosta', v)}
                                                    options={[
                                                        {label: 'П', value: 'писмо'},
                                                        {label: 'Т', value: 'телеграма'},
                                                    ]}
                                                />
                                            },
                                            {
                                                label: 'Датум заведување', field: 'datumZaveduvanje',
                                                filter: <ColFilter value={filters.datumZaveduvanje}
                                                                   onChange={(v) => hf('datumZaveduvanje', v)}
                                                                   placeholder="Датум..."/>
                                            },
                                            {
                                                label: 'Број акт (нивни)', field: null,
                                                filter: <ColFilter value={filters.brAktNivni}
                                                                   onChange={(v) => hf('brAktNivni', v)}
                                                                   placeholder="Бр.акт..."/>
                                            },
                                            {
                                                label: 'Испраќач', field: null,
                                                filter: <ColDropdown
                                                    value={filters.isprakjacId}
                                                    onChange={(v) => hfInstant('isprakjacId', v)}
                                                    options={isprakjaci || []}
                                                    getLabel={(o) => o.naziv}
                                                    getId={(o) => o.id}
                                                    placeholder="Испраќач..."
                                                />
                                            },
                                            {
                                                label: 'Одговорно лице', field: null,
                                                filter: <ColDropdown
                                                    value={filters.odgovornoLiceId}
                                                    onChange={(v) => hfInstant('odgovornoLiceId', v)}
                                                    options={odgovornoLice || []}
                                                    getLabel={(o) => `${o.ime} ${o.prezime}`}
                                                    getId={(o) => o.id}
                                                    placeholder="Лице..."
                                                />
                                            },
                                            {
                                                label: 'Предмет', field: null,
                                                filter: <ColDropdown
                                                    value={filters.vidPredmetDobienaId || filters.vidPredmetIspratenaId}
                                                    onChange={(v) => {
                                                        if (filters.tipDelovnik === 'Ispratena') {
                                                            hfInstant('vidPredmetIspratenaId', v);
                                                        } else {
                                                            hfInstant('vidPredmetDobienaId', v);
                                                        }
                                                    }}
                                                    options={filters.tipDelovnik === 'Ispratena'
                                                        ? (vidPredmetI || [])
                                                        : [...(vidPredmetD || []), ...(vidPredmetI || [])]}
                                                    getLabel={(o) => o.naziv}
                                                    getId={(o) => o.id}
                                                    placeholder="Предмет..."
                                                />
                                            },
                                            {
                                                label: 'Содржина', field: null,
                                                filter: <ColFilter value={filters.sodrzina}
                                                                   onChange={(v) => hf('sodrzina', v)}
                                                                   placeholder="Содржина..."/>
                                            },
                                            {
                                                label: 'Реализ.', field: null,
                                                filter: <ColRadio
                                                    value={filters.realizirano}
                                                    onChange={(v) => hfInstant('realizirano', v)}
                                                    options={[
                                                        {label: 'Да', value: 'true'},
                                                        {label: 'Не', value: 'false'},
                                                    ]}
                                                />
                                            },
                                            {
                                                label: 'Архива', field: null,
                                                filter: <ColDropdown
                                                    value={filters.arhivaId}
                                                    onChange={(v) => hfInstant('arhivaId', v)}
                                                    options={arhiva || []}
                                                    getLabel={(o) => `${o.naziv}`}
                                                    getId={(o) => o.id}
                                                    placeholder="Архива..."
                                                />
                                            },
                                            {
                                                label: 'Забелешка', field: null,
                                                filter: <ColFilter value={filters.zabeleska}
                                                                   onChange={(v) => hf('zabeleska', v)}
                                                                   placeholder="Забелешка..."/>
                                            },
                                            {
                                                label: 'Статус', field: null,
                                                filter: <ColDropdown
                                                    value={filters.statusPredmet}
                                                    onChange={(v) => hfInstant('statusPredmet', v)}
                                                    options={statusPredmet?.map(s => ({
                                                        id: s,
                                                        naziv: s.replace(/_/g, ' ')
                                                    })) || []}
                                                    getLabel={(o) => o.naziv}
                                                    getId={(o) => o.id}
                                                    placeholder="Статус..."
                                                />
                                            },
                                        ].map(({label, field, filter}) => (
                                            <TableCell key={label}
                                                       sx={{
                                                           verticalAlign: 'top',
                                                           whiteSpace: 'nowrap',
                                                           borderBottom: 'none',
                                                           padding: '8px !important',
                                                       }}
                                            >
                                                <Box
                                                    onClick={() => field && handleSort(field)}
                                                    sx={{
                                                        display: 'flex', alignItems: 'center', gap: 0.3,
                                                        fontWeight: 'bold', color: '#fff',
                                                        cursor: field ? 'pointer' : 'default',
                                                        userSelect: 'none', mb: 0.6,
                                                    }}
                                                >
                                                    {label}
                                                    {field && <SortIcon field={field} sort={sort}/>}
                                                </Box>
                                                {filter}
                                            </TableCell>
                                        ))}
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
                                                  sx={{
                                                      '&:hover': {bgcolor: 'lightgray'}, cursor: 'pointer',
                                                      '&:last-child td': {borderBottom: 'none'}
                                                  }}
                                                  onClick={() => navigate(`/posta/${predmet.id}`)}
                                        >
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{
                                                    fontSize: '0.82rem',
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    fontFamily: 'monospace'
                                                }}>
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
                                                <Typography sx={{
                                                    fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                }}>
                                                    {predmet.isprakjacNaziv || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{
                                                    fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                }}>
                                                    {predmet.odgovornoLiceNaziv?.join(', ') || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{
                                                    fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                }}>
                                                    {predmet.vidPredmetNaziv?.join('/') || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{
                                                    fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 200, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                }}>
                                                    {predmet.sodrzina || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{
                                                    fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 200, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                }}>
                                                    {predmet.realizirano ? "Да" : "Не"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{
                                                    fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                }}>
                                                    {predmet.arhivaNaziv?.join(', ') || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <Typography sx={{
                                                    fontSize: '0.78rem', color: '#444',
                                                    maxWidth: 140, overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                }}>
                                                    {predmet.zabeleska || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{py: 1}}>
                                                <StatusChip status={formatStatus(predmet.statusPredmet)}/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* PAGINATION */}
                    {data && data.page.totalPages > 1 && (
                        <Box sx={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', mt: 2
                        }}>
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
                </CardContent>
            </Card>
        </Box>
    );
};

export default PredmetiList;