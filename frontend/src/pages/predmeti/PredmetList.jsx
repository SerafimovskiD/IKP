// src/pages/PredmetiList.jsx
import {useState, useMemo, useCallback, useEffect} from 'react';
import {
    Box, Typography, TextField, Autocomplete,
    Button, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Paper, Pagination, InputAdornment,
    Card, CardHeader, CardContent, Divider, Collapse, IconButton,
    ToggleButton, ToggleButtonGroup,
    Menu, MenuItem, Checkbox, ListItemText
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import TagIcon from '@mui/icons-material/Tag';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import NotesIcon from '@mui/icons-material/Notes';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router-dom';
import { predmetiApi } from '../../api/predmeti.js';
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

const PAGE_SIZE = 20;

const MESECI_IMINJA = ['Јан', 'Фев', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Нов', 'Дек'];
const MESECI_OPTIONS = MESECI_IMINJA.map((label, i) => ({value: String(i + 1).padStart(2, '0'), label}));


// Клучевите на сите колони од табелата (за состојбата на видливост).
const COLUMN_KEYS = [
    'redenBroj', 'tipDelovnik', 'tipPosta', 'datumZaveduvanje', 'brAktNivni',
    'brAktArhivski', 'datumIsprakjanje',
    'isprakjacIme', 'promenilKorisnik', 'odgovornoLice', 'dodelenoNa', 'vidPredmet', 'sodrzina', 'realizirano',
    'arhiva', 'zabeleska', 'statusPredmet',
];

const EMPTY_FILTERS = {
    search: '',
    arhivaId: '',
    arhivaNaziv: '',
    brAkt: '',
    brAktNivni: '',
    brAktArhivski: '',
    datumZaveduvanje: '',
    datumIsprakjanje: '',
    godina: '',
    isprakjacIme: '',
    promenilKorisnik: '',
    odgovornoLiceId: '',
    dodelenoNaId: '',
    realizirano: '',
    redenBroj: '',
    sodrzina: '',
    statusPredmet: '',
    tipDelovnik: '',
    tipPosta: '',
    vidPredmetDobienaId: '',
    vidPredmetIspratenaId: '',
    zabeleska: '',
};

// Ги паметиме последната состојба на пребарувањето/табелата во sessionStorage - за
// да не се губи кога корисникот отвора предмет и се враќа назад (browser back).
// sessionStorage (не localStorage) - се брише кога ќе се затвори табот, не е трајно.
// Одделени клучеви за филтрите/поставките (мали, менуваат често) и за самите
// превземени податоци (allData - поголеми, менуваат само по пребарување), за да не
// се сериjализира целиот allData на секој тастер во некој филтер.
const FILTERS_STORAGE_KEY = 'predmetList.filters.v1';
const DATA_STORAGE_KEY = 'predmetList.data.v1';
// Паметењето важи само 2 минути откако корисникот ќе ја напушти страницата - по тоа
// истечено време состојбата се смета за застарена и страницата тргнува од почеток
// (како да немало ништо зачувано), наместо да остане "заглавена" на старото пребарување.
const STATE_TTL_MS = 2 * 60 * 1000;

const readStored = (key) => {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.savedAt || Date.now() - parsed.savedAt > STATE_TTL_MS) {
            sessionStorage.removeItem(key);
            return null;
        }
        return parsed.value;
    } catch {
        return null;
    }
};

const writeStored = (key, value) => {
    try {
        sessionStorage.setItem(key, JSON.stringify({savedAt: Date.now(), value}));
    } catch {
        // sessionStorage недостапен/полн - тивко се прескокнува.
    }
};

const readStoredFilters = () => readStored(FILTERS_STORAGE_KEY);
const readStoredData = () => readStored(DATA_STORAGE_KEY);

const PredmetiList = () => {

    const navigate = useNavigate();

    // Иницијално видливи се само: Наш број, вид пошта, датум заведување, број акт(нивни),
    // испраќач, одговорно лице, доделено на, предмет, содржина, реализ, архива, забелешка, статус.
    const DEFAULT_VISIBLE_COLS = [
        'redenBroj', 'tipPosta', 'datumZaveduvanje', 'brAktNivni',
        'isprakjacIme', 'promenilKorisnik', 'odgovornoLice', 'dodelenoNa', 'vidPredmet', 'sodrzina',
        'realizirano', 'arhiva', 'zabeleska', 'statusPredmet',
    ];

    // Се читаат еднаш при монтирање (свежо на секое враќање на страницата преку "back").
    const storedFilters = readStoredFilters();
    const storedData = readStoredData();

    // Сите записи од последното пребарување кон backend-от (само еден повик).
    const [allData, setAllData] = useState(() => storedData?.allData ?? []);
    // Ако backend-от навистина има повеќе резултати отколку што ги превземавме во еден повик
    // (size=100000), тука го чуваме реалниот вкупен број за да предупредиме дека листата е
    // намалена, наместо молчешкум да недостасуваат резултати.
    const [totalOnServer, setTotalOnServer] = useState(() => storedData?.totalOnServer ?? null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(() => storedFilters?.hasSearched ?? false);
    // Формата со филтрите е отворена при прв пристап до страницата; по пребарувањето
    // се затвора (за да не зазема простор) но останува достапна преку копчето за отворање.
    const [filtersOpen, setFiltersOpen] = useState(() => storedFilters?.filtersOpen ?? true);

    // Филтрите од главната форма - се користат ИСКЛУЧИВО за повикот кон backend-от (копчето „Пребарај“).
    const [searchForm, setSearchForm] = useState(() => storedFilters?.searchForm ?? EMPTY_FILTERS);
    // Филтрите во колоните на табелата - работат ИСКЛУЧИВО локално, врз веќе превземените
    // податоци (allData), без никаков повик кон backend-от.
    const [colFilters, setColFilters] = useState(() => storedFilters?.colFilters ?? EMPTY_FILTERS);
    // Филтерот за месец во формата (комбинирано со постоечкото поле "Година") се спојува во истиот
    // searchForm.datumZaveduvanje низа-филтер како и досега (истата логика на backend-от -
    // hasDatumZaveduvanjeLike прави LIKE '%YYYY-MM-DD%' пребарување).
    const [mesecZaveduvanje, setMesecZaveduvanje] = useState(() => storedFilters?.mesecZaveduvanje ?? '');

    const [page, setPage] = useState(() => storedFilters?.page ?? 0);
    const [sort, setSort] = useState(() => storedFilters?.sort ?? {field: 'datumZaveduvanje', dir: 'desc'});
    // Кои колони од табелата се видливи - корисникот сам избира преку копчето "Колони".
    const [visibleCols, setVisibleCols] = useState(
        () => storedFilters?.visibleCols
            ?? Object.fromEntries(COLUMN_KEYS.map(k => [k, DEFAULT_VISIBLE_COLS.includes(k)]))
    );
    const [colsMenuAnchor, setColsMenuAnchor] = useState(null);
    const toggleCol = (key) => setVisibleCols(p => ({...p, [key]: !p[key]}));

    // Ги зачувуваме филтрите/поставките на секоја промена (лесни податоци, честа промена -
    // на секој тастер во некој филтер) - за да се вратат при следно монтирање (browser back),
    // но само во рок од 2 минути (STATE_TTL_MS) - по тоа се смета за застарено.
    useEffect(() => {
        writeStored(FILTERS_STORAGE_KEY, {
            hasSearched, filtersOpen, searchForm, colFilters,
            mesecZaveduvanje, page, sort, visibleCols,
        });
    }, [hasSearched, filtersOpen, searchForm, colFilters, mesecZaveduvanje, page, sort, visibleCols]);

    // Одделно ги зачувуваме превземените податоци (allData) - поголеми, се менуваат само
    // по завршено пребарување, не на секој тастер.
    useEffect(() => {
        writeStored(DATA_STORAGE_KEY, {allData, totalOnServer});
    }, [allData, totalOnServer]);

    const {odgovornoLice, dodelenoNa} = useUsersOdgovornoLice();
    const {vidPredmetD} = useVidPredmetDobieno();
    const {vidPredmetI} = useVidPredmetIspratena();
    const {arhiva} = useArhiva();
    const {statusPredmet} = useEnums();

    // Еден повик кон backend-от - ги земаме сите записи според тековните филтри
    // (arhivaNaziv и brAkt не постојат како параметри на backend-от, тие се филтрираат само на frontend).
    const fetchData = useCallback(async (searchFilters) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('page', 0);
            params.append('size', 1000000);
            params.append('sort', `${sort.field},${sort.dir}`);

            if (searchFilters.godina) params.append('godina', searchFilters.godina);
            if (searchFilters.datumZaveduvanje) params.append('datumZaveduvanje', searchFilters.datumZaveduvanje);
            if (searchFilters.redenBroj) params.append('redenBroj', searchFilters.redenBroj);
            if (searchFilters.brAktNivni) params.append('brAktNivni', searchFilters.brAktNivni);
            if (searchFilters.sodrzina) params.append('sodrzina', searchFilters.sodrzina);
            if (searchFilters.zabeleska) params.append('zabeleska', searchFilters.zabeleska);
            if (searchFilters.isprakjacIme) params.append('isprakjacIme', searchFilters.isprakjacIme);
            if (searchFilters.odgovornoLiceId) params.append('odgovornoLiceId', searchFilters.odgovornoLiceId);
            if (searchFilters.dodelenoNaId) params.append('dodelenoNaId', searchFilters.dodelenoNaId);
            if (searchFilters.brAktArhivski) params.append('brAktArhivski', searchFilters.brAktArhivski);
            if (searchFilters.promenilKorisnik) params.append('promenilKorisnik', searchFilters.promenilKorisnik);
            if (searchFilters.vidPredmetDobienaId) params.append('vidPredmetDobienaId', searchFilters.vidPredmetDobienaId);
            if (searchFilters.vidPredmetIspratenaId) params.append('vidPredmetIspratenaId', searchFilters.vidPredmetIspratenaId);
            if (searchFilters.realizirano !== '') params.append('realizirano', searchFilters.realizirano);
            if (searchFilters.tipDelovnik) params.append('tipDelovnik', searchFilters.tipDelovnik);
            if (searchFilters.tipPosta) params.append('tipPosta', searchFilters.tipPosta);
            if (searchFilters.statusPredmet) params.append('statusPredmet', searchFilters.statusPredmet);
            if (searchFilters.arhivaId) params.append('arhivaId', searchFilters.arhivaId);
            if (searchFilters.search) params.append('search', searchFilters.search);

            const res = await predmetiApi.getAll(Object.fromEntries(params));
            let content = res?.content ?? [];
            setTotalOnServer(res?.page?.totalElements ?? content.length);
            // Backend-от филтрира datumZaveduvanje со LIKE '%-MM-%' - точна позиција на месецот
            // во "YYYY-MM-DD", но тука сепак ја потврдуваме точноста врз реалната вредност на секој
            // предмет (без нов backend повик), како дополнителна гаранција.
            if (mesecZaveduvanje) {
                content = content.filter(p => {
                    if (!p.datumZaveduvanje) return false;
                    const mm = p.datumZaveduvanje.split('-')[1];
                    return mm === mesecZaveduvanje;
                });
            }

            setAllData(content);
            setPage(0);
        } catch {
            setError('Грешка при вчитување');
        } finally {
            setLoading(false);
        }
    }, [sort, mesecZaveduvanje]);

    // Ажурира поле во главната форма (backend филтри) - не влијае на филтрите во колоните.
    const hf = (field, value) => {
        setSearchForm(p => ({...p, [field]: value}));
    };

    // Ажурира поле во филтрите на колоните (само frontend) - не влијае на главната форма.
    const hfCol = (field, value) => {
        setColFilters(p => ({...p, [field]: value}));
        setPage(0);
    };

    // Го поставува месецот и го спојува во истиот "YYYY-MM-DD" филтер-низа што backend-от ја
    // користи за LIKE пребарување ("-MM-" - цртичка од двете страни, точно на позицијата на месецот).
    const hfMesec = (value) => {
        setMesecZaveduvanje(value);
        hf('datumZaveduvanje', value ? `-${String(value).padStart(2, '0')}-` : '');
    };

    const clearFilters = () => {
        setSearchForm(EMPTY_FILTERS);
        setMesecZaveduvanje('');
        setAllData([]);
        setTotalOnServer(null);
        setHasSearched(false);
        setFiltersOpen(true);
        setPage(0);
    };

    const handleSearch = () => {
        setHasSearched(true);
        // Секое ново пребарување кон backend-от ги ресетира и филтрите во колоните -
        // инаку "заборавен" филтер во некоја колона би можел молчешкум да сокрие
        // резултат што backend-от штотуку точно го врати.
        setColFilters(EMPTY_FILTERS);
        setPage(0);
        setFiltersOpen(false);
        fetchData(searchForm);
    };

    const activeFilterCount = useMemo(
        () => Object.values(searchForm).filter(v => v !== '').length,
        [searchForm]
    );
    // Филтрирањето во колоните на табелата работи ИСКЛУЧИВО локално, врз веќе
    // превземените податоци (allData) - без никаков нов повик кон backend-от.
    const filteredData = useMemo(() => {
        const matchesText = (value, needle) =>
            !needle || (value ?? '').toString().toLowerCase().includes(needle.toLowerCase());

        return allData.filter(p => {
            if (colFilters.arhivaId && !(p.arhivaId ?? []).map(String).includes(String(colFilters.arhivaId))) return false;
            if (!matchesText((p.arhivaNaziv ?? []).join(', '), colFilters.arhivaNaziv)) return false;
            if (!matchesText(p.brAkt, colFilters.brAkt)) return false;
            if (!matchesText(p.brAktNivni, colFilters.brAktNivni)) return false;
            if (!matchesText(p.brAktArhivski, colFilters.brAktArhivski)) return false;
            if (!matchesText(p.datumZaveduvanje, colFilters.datumZaveduvanje)) return false;
            if (!matchesText(p.datumIsprakjanje, colFilters.datumIsprakjanje)) return false;
            if (colFilters.godina && String(p.godina) !== String(colFilters.godina)) return false;
            if (!matchesText(p.isprakjacIme, colFilters.isprakjacIme)) return false;
            if (!matchesText(p.promenilKorisnik, colFilters.promenilKorisnik)) return false;
            if (colFilters.odgovornoLiceId && !(p.odgovornoLiceId ?? []).map(String).includes(String(colFilters.odgovornoLiceId))) return false;
            if (colFilters.dodelenoNaId && !(p.dodelenoNaId ?? []).map(String).includes(String(colFilters.dodelenoNaId))) return false;
            if (colFilters.realizirano !== '' && String(!!p.realizirano) !== String(colFilters.realizirano)) return false;
            if (!matchesText(p.redenBroj, colFilters.redenBroj)) return false;
            if (!matchesText(p.sodrzina, colFilters.sodrzina)) return false;
            if (colFilters.statusPredmet && p.statusPredmet !== colFilters.statusPredmet) return false;
            if (colFilters.tipDelovnik && p.tipDelovnik !== colFilters.tipDelovnik) return false;
            if (colFilters.tipPosta && p.tipPosta !== colFilters.tipPosta) return false;
            if (colFilters.vidPredmetDobienaId && !(p.vidPredmetId ?? []).map(String).includes(String(colFilters.vidPredmetDobienaId))) return false;
            if (colFilters.vidPredmetIspratenaId && !(p.vidPredmetId ?? []).map(String).includes(String(colFilters.vidPredmetIspratenaId))) return false;
            if (!matchesText(p.zabeleska, colFilters.zabeleska)) return false;
            return true;
        });
    }, [allData, colFilters]);

    const sortedData = useMemo(() => {
        const arr = [...filteredData];
        arr.sort((a, b) => {
            const av = a[sort.field];
            const bv = b[sort.field];
            if (av == null && bv == null) return 0;
            if (av == null) return sort.dir === 'asc' ? -1 : 1;
            if (bv == null) return sort.dir === 'asc' ? 1 : -1;
            if (av < bv) return sort.dir === 'asc' ? -1 : 1;
            if (av > bv) return sort.dir === 'asc' ? 1 : -1;
            return 0;
        });
        return arr;
    }, [filteredData, sort]);

    const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));
    const pagedData = useMemo(
        () => sortedData.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
        [sortedData, page]
    );

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

    // Дефиниција на сите колони - заедничка за заглавието и телото на табелата,
    // за да "Колони" копчето може да ги вклучува/исклучува двете конзистентно.
    const allColumns = [
        {
            key: 'redenBroj', label: 'Наш бр.', field: 'redenBroj', minWidth: 80,
            filter: <ColFilter value={colFilters.redenBroj}
                               onChange={(v) => hfCol('redenBroj', v)}
                               placeholder="Број..."/>,
            cell: (predmet) => (
                <Typography sx={{fontSize: '0.82rem', fontWeight: 600, color: '#333', fontFamily: 'monospace'}}>
                    {predmet.redenBroj}
                    {/* vkPodBroevi - вкупен број на под-предмети (под броеви) за истиот
                        реден број/година (пр. 765/3 - реден број 765, вкупно 3 под-предмети) -
                        се прикажува само кога има повеќе од 1, за да не оптоварува кога е обичен случај. */}
                    {predmet.vkPodBroevi > 1 && (
                        <Typography component="span" sx={{
                            fontSize: '0.7rem', fontWeight: 500, color: '#999', ml: 0.3,
                        }}>
                            /{predmet.vkPodBroevi}
                        </Typography>
                    )}
                </Typography>
            ),
        },
        {
            key: 'tipDelovnik', label: 'Вид пошта', field: null, minWidth: 100,
            filter: <ColRadio
                value={colFilters.tipDelovnik}
                onChange={(v) => hfCol('tipDelovnik', v)}
                options={[
                    {label: 'ДП', value: 'Dobiena'},
                    {label: 'ИП', value: 'Ispratena'},
                ]}
            />,
            cell: (predmet) => <TipBadge tip={predmet.tipDelovnik}/>,
        },
        {
            key: 'tipPosta', label: 'Тип пошта', field: null, minWidth: 85,
            filter: <ColRadio
                value={colFilters.tipPosta}
                onChange={(v) => hfCol('tipPosta', v)}
                options={[
                    {label: 'П', value: 'писмо'},
                    {label: 'Т', value: 'телеграма'},
                ]}
            />,
            cell: (predmet) => (
                <Typography sx={{fontSize: '0.78rem', color: '#666'}}>{predmet.tipPosta}</Typography>
            ),
        },
        {
            key: 'datumZaveduvanje', label: 'Датум завед.', field: 'datumZaveduvanje', minWidth: 110,
            filter: <ColFilter value={colFilters.datumZaveduvanje}
                               onChange={(v) => hfCol('datumZaveduvanje', v)}
                               placeholder="Датум..."/>,
            cell: (predmet) => (
                <Typography sx={{fontSize: '0.78rem', color: '#666'}}>{predmet.datumZaveduvanje}</Typography>
            ),
        },
        {
            key: 'brAktNivni', label: 'Број акт (нивни)', field: null, minWidth: 110,
            filter: <ColFilter value={colFilters.brAktNivni}
                               onChange={(v) => hfCol('brAktNivni', v)}
                               placeholder="Бр.акт..."/>,
            cell: (predmet) => (
                <Typography sx={{fontSize: '0.78rem', color: '#666'}}>{predmet.brAktNivni || '—'}</Typography>
            ),
        },
        {
            key: 'brAktArhivski', label: 'Број акт (арх.)', field: null, minWidth: 110,
            filter: <ColFilter value={colFilters.brAktArhivski}
                               onChange={(v) => hfCol('brAktArhivski', v)}
                               placeholder="Бр.акт..."/>,
            cell: (predmet) => (
                <Typography sx={{fontSize: '0.78rem', color: '#666'}}>{predmet.brAktArhivski || '—'}</Typography>
            ),
        },
        {
            key: 'datumIsprakjanje', label: 'Датум испр.', field: 'datumIsprakjanje', minWidth: 110,
            filter: <ColFilter value={colFilters.datumIsprakjanje}
                               onChange={(v) => hfCol('datumIsprakjanje', v)}
                               placeholder="Датум..."/>,
            cell: (predmet) => (
                <Typography sx={{fontSize: '0.78rem', color: '#666'}}>{predmet.datumIsprakjanje || '—'}</Typography>
            ),
        },
        {
            key: 'isprakjacIme', label: 'Испраќач', field: null, minWidth: 150,
            filter: <ColFilter value={colFilters.isprakjacIme}
                               onChange={(v) => hfCol('isprakjacIme', v)}
                               placeholder="Содржина..."/>,
            cell: (predmet) => (
                <Typography sx={{
                    fontSize: '0.78rem', color: '#444',
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {predmet.isprakjacIme || '—'}
                </Typography>
            ),
        },
        {
            key: 'promenilKorisnik', label: 'Извршил промена', field: null, minWidth: 150,
            filter: <ColFilter value={colFilters.promenilKorisnik}
                               onChange={(v) => hfCol('promenilKorisnik', v)}
                               placeholder="Корисник..."/>,
            cell: (predmet) => (
                <Typography sx={{
                    fontSize: '0.78rem', color: '#444',
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {predmet.promenilKorisnik || '—'}
                </Typography>
            ),
        },
        {
            key: 'odgovornoLice', label: 'Одговорно лице', field: null, minWidth: 150,
            filter: <ColDropdown
                value={colFilters.odgovornoLiceId}
                onChange={(v) => hfCol('odgovornoLiceId', v)}
                options={odgovornoLice || []}
                getLabel={(o) => `${o.ime} ${o.prezime}`}
                getId={(o) => o.id}
                placeholder="Лице..."
            />,
            cell: (predmet) => (
                <Typography sx={{
                    fontSize: '0.78rem', color: '#444',
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {predmet.odgovornoLiceNaziv?.join(', ') || '—'}
                </Typography>
            ),
        },
        {
            key: 'dodelenoNa', label: 'Доделено на', field: null, minWidth: 150,
            filter: <ColDropdown
                value={colFilters.dodelenoNaId}
                onChange={(v) => hfCol('dodelenoNaId', v)}
                options={dodelenoNa || []}
                getLabel={(o) => `${o.ime} ${o.prezime}`}
                getId={(o) => o.id}
                placeholder="Лице..."
            />,
            cell: (predmet) => (
                <Typography sx={{
                    fontSize: '0.78rem', color: '#444',
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {predmet.dodelenoNaNaziv?.join(', ') || '—'}
                </Typography>
            ),
        },
        {
            key: 'vidPredmet', label: 'Предмет', field: null, minWidth: 150,
            // Оваа колона спојува два различни списока - "Вид предмет (добиена)" и
            // "Вид предмет (испратена)" - во еден dropdown. За да не се мешаат опциите
            // (и за да не се постави погрешно поле кога филтерот "Вид пошта" не е избран),
            // секоја опција се означува со _tip ('D'/'I'), се групираат визуелно во
            // dropdown-от (ColDropdown groupBy), а id-то се прави уникатно ("D:5"/"I:5")
            // за да не се судираат идентични ID-а од двете табели.
            filter: <ColDropdown
                value={
                    colFilters.vidPredmetIspratenaId ? `I:${colFilters.vidPredmetIspratenaId}`
                        : colFilters.vidPredmetDobienaId ? `D:${colFilters.vidPredmetDobienaId}`
                        : ''
                }
                onChange={(_, option) => {
                    if (!option) {
                        hfCol('vidPredmetDobienaId', '');
                        hfCol('vidPredmetIspratenaId', '');
                        return;
                    }
                    if (option._tip === 'I') {
                        hfCol('vidPredmetIspratenaId', option.id);
                        hfCol('vidPredmetDobienaId', '');
                    } else {
                        hfCol('vidPredmetDobienaId', option.id);
                        hfCol('vidPredmetIspratenaId', '');
                    }
                }}
                options={colFilters.tipDelovnik === 'Ispratena'
                    ? (vidPredmetI || []).map(o => ({...o, _tip: 'I'}))
                    : [
                        ...(vidPredmetD || []).map(o => ({...o, _tip: 'D'})),
                        ...(vidPredmetI || []).map(o => ({...o, _tip: 'I'})),
                    ]}
                getLabel={(o) => o.naziv}
                getId={(o) => `${o._tip}:${o.id}`}
                groupBy={(o) => o._tip === 'I' ? 'Испратена' : 'Добиена'}
                placeholder="Предмет..."
            />,
            cell: (predmet) => (
                <Typography sx={{
                    fontSize: '0.78rem', color: '#444',
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {predmet.vidPredmetNaziv?.join('/') || '—'}
                </Typography>
            ),
        },
        {
            key: 'sodrzina', label: 'Содржина', field: null, minWidth: 180,
            filter: <ColFilter value={colFilters.sodrzina}
                               onChange={(v) => hfCol('sodrzina', v)}
                               placeholder="Содржина..."/>,
            cell: (predmet) => (
                <Typography sx={{
                    fontSize: '0.78rem', color: '#444',
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {predmet.sodrzina || '—'}
                </Typography>
            ),
        },
        {
            key: 'realizirano', label: 'Реализ.', field: null, minWidth: 90,
            filter: <ColRadio
                value={colFilters.realizirano}
                onChange={(v) => hfCol('realizirano', v)}
                options={[
                    {label: 'Да', value: 'true'},
                    {label: 'Не', value: 'false'},
                ]}
            />,
            cell: (predmet) => (
                <Typography sx={{
                    fontSize: '0.78rem', color: '#444',
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {predmet.realizirano ? "Да" : "Не"}
                </Typography>
            ),
        },
        {
            key: 'arhiva', label: 'Архива', field: null, minWidth: 150,
            filter: <ColDropdown
                value={colFilters.arhivaId}
                onChange={(v) => hfCol('arhivaId', v)}
                options={arhiva || []}
                getLabel={(o) => `${o.naziv}`}
                getId={(o) => o.id}
                placeholder="Архива..."
            />,
            cell: (predmet) => (
                <Typography sx={{
                    fontSize: '0.78rem', color: '#444',
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {predmet.arhivaNaziv?.join(', ') || '—'}
                </Typography>
            ),
        },
        {
            key: 'zabeleska', label: 'Забелешка', field: null, minWidth: 180,
            filter: <ColFilter value={colFilters.zabeleska}
                               onChange={(v) => hfCol('zabeleska', v)}
                               placeholder="Забелешка..."/>,
            cell: (predmet) => (
                <Typography sx={{
                    fontSize: '0.78rem', color: '#444',
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {predmet.zabeleska || '—'}
                </Typography>
            ),
        },
        {
            key: 'statusPredmet', label: 'Статус', field: null, minWidth: 200,
            filter: <ColDropdown
                value={colFilters.statusPredmet}
                onChange={(v) => hfCol('statusPredmet', v)}
                options={statusPredmet?.map(s => ({id: s, naziv: s.replace(/_/g, ' ')})) || []}
                getLabel={(o) => o.naziv}
                getId={(o) => o.id}
                placeholder="Статус..."
            />,
            cell: (predmet) => <StatusChip status={formatStatus(predmet.statusPredmet)}/>,
        },
    ];

    const columns = allColumns.filter(c => visibleCols[c.key]);

    return (
        <Box sx={{p: 3}}>

            {/* ── НАСЛОВ ── */}
            <Box sx={{
                background: 'linear-gradient(240deg, #b6a268 0%, #dbbd5e 70%, #826f35 100%)',
                borderRadius: '0% 100% 100% 0% / 50% 50% 50% 50%',
                mb: '5px', px: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Typography variant="h6" sx={{color: '#000'}}>
                    Пребарување — Листа на пошти
                </Typography>
            </Box>
            <Divider/>
            <br/>
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

                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                        sx={{
                            bgcolor: '#fff', border: '1px solid #E4E4E4',
                            borderRadius: '12px', mb: 2.5,
                            boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
                            overflow: 'hidden'
                        }}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center',
                            px: {xs: 2, md: 1},
                            borderBottom: filtersOpen ? '1px solid #EEE' : 'none',
                        }}>
                            {/* Копче за избор на видливи колони - мала икона, лево */}
                            <IconButton
                                size="small"
                                onClick={(e) => setColsMenuAnchor(e.currentTarget)}
                                title="Избери видливи колони"
                                sx={{color: THEME.accent, mr: 0.5}}
                            >
                                <ViewColumnIcon sx={{fontSize: 18}}/>
                            </IconButton>
                            <Menu
                                anchorEl={colsMenuAnchor}
                                open={!!colsMenuAnchor}
                                onClose={() => setColsMenuAnchor(null)}
                                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                                transformOrigin={{vertical: 'top', horizontal: 'left'}}
                            >
                                {allColumns.map(col => (
                                    <MenuItem key={col.key} onClick={() => toggleCol(col.key)} dense>
                                        <Checkbox size="small" checked={!!visibleCols[col.key]}
                                                  sx={{p: 0.5, mr: 0.5, color: THEME.accent, '&.Mui-checked': {color: THEME.accent}}}/>
                                        <ListItemText primaryTypographyProps={{fontSize: '0.85rem'}}>
                                            {col.label}
                                        </ListItemText>
                                    </MenuItem>
                                ))}
                            </Menu>

                            <Box
                                onClick={() => setFiltersOpen(o => !o)}
                                sx={{
                                    flex: '0 0 95%', maxWidth: '95%',
                                    display: 'flex', alignItems: 'center', gap: 1,
                                    py: 1.25,
                                    cursor: 'pointer',
                                }}>
                                <FilterListIcon sx={{fontSize: 19, color: THEME.accent}}/>
                                <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: '#333', letterSpacing: '0.01em'}}>
                                    Филтри за пребарување
                                </Typography>
                                {activeFilterCount > 0 && (
                                    <Box sx={{
                                        bgcolor: THEME.accent, color: '#fff', fontSize: '0.68rem',
                                        fontWeight: 700, borderRadius: '9px', minWidth: 18, height: 18,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.6,
                                    }}>
                                        {activeFilterCount}
                                    </Box>
                                )}
                                <Box sx={{flex: 1}}/>
                                <IconButton
                                    size="small"
                                    disabled={true}
                                    onClick={(e) => { e.stopPropagation(); setFiltersOpen(o => !o); }}
                                    sx={{color: THEME.accent}}
                                >
                                    {filtersOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                </IconButton>
                            </Box>
                        </Box>

                        <Collapse in={filtersOpen}>
                        {/* ГОЛЕМ ОПШТ ФИЛТЕР - пребарува преку backend-от (searchText) низ број
                            акт (нивни/архивски), датуми, содржина, забелешка, испраќач,
                            одговорно лице, доделено на, извршил промена, вид на предмет
                            и архива - едновремено. */}
                        <Box sx={{px: {xs: 2, md: 3}, pt: 2.5}}>
                            <TextField
                                fullWidth
                                value={searchForm.search}
                                onChange={(e) => hf('search', e.target.value)}
                                placeholder="Општо пребарување — број акт, содржина, забелешка, испраќач, одговорно лице, доделено на, извршил промена, вид на предмет, архива..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{fontSize: 20, color: THEME.accent}}/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchForm.search && (
                                        <InputAdornment position="end">
                                            <ClearIcon
                                                sx={{fontSize: 16, color: '#999', cursor: 'pointer'}}
                                                onClick={() => hf('search', '')}
                                            />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        bgcolor: THEME.accentLight, fontSize: '0.95rem',
                                        '& fieldset': {borderColor: THEME.border},
                                        '&:hover fieldset': {borderColor: THEME.accent},
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            gap: 2.5, px: {xs: 2, md: 3}, py: 2.5,
                        }}>
                            <LabeledField label="Наш број">
                                <TextField fullWidth size="small" placeholder="Број..."
                                           sx={{m:0}}
                                           value={searchForm.redenBroj}
                                           onChange={(e) => hf('redenBroj', e.target.value)}
                                           InputProps={{startAdornment: (
                                               <InputAdornment position="start"><TagIcon sx={{fontSize: 17, color: '#AAA'}}/></InputAdornment>
                                           )}}/>
                            </LabeledField>

                            <LabeledField label="Година / Месец">
                                <Box sx={{display: 'flex', gap: 1}}>
                                    <TextField size="small" type="number" placeholder="Година..."
                                               value={searchForm.godina}
                                               onChange={(e) => hf('godina', e.target.value)}
                                               sx={{flex: '0 0 40%', minWidth: 0,m:0}}/>
                                    <Autocomplete
                                        size="small"
                                        options={MESECI_OPTIONS}
                                        value={MESECI_OPTIONS.find(o => o.value === mesecZaveduvanje) || null}
                                        getOptionLabel={(o) => o.label}
                                        isOptionEqualToValue={(o, v) => o.value === v.value}
                                        onChange={(_, newValue) => hfMesec(newValue ? newValue.value : '')}
                                        sx={{flex: 1, minWidth: 0,mt:-1}}
                                        renderInput={(params) => <TextField {...params} placeholder="Месец..."/>}
                                    />
                                </Box>
                            </LabeledField>

                            <ToggleField
                                label="Вид пошта"
                                value={searchForm.tipDelovnik}
                                onChange={(v) => hf('tipDelovnik', v)}
                                options={[
                                    {label: 'Добиена', value: 'Dobiena'},
                                    {label: 'Испратена', value: 'Ispratena'},
                                ]}
                            />

                            <ToggleField
                                label="Тип пошта"
                                value={searchForm.tipPosta}
                                onChange={(v) => hf('tipPosta', v)}
                                options={[
                                    {label: 'Писмо', value: 'писмо'},
                                    {label: 'Телеграма', value: 'телеграма'},
                                ]}
                            />

                            <LabeledField label="Број акт (нивни)">
                                <TextField fullWidth size="small" placeholder="Нивен акт..." sx={{m:0}}
                                           value={searchForm.brAktNivni}
                                           onChange={(e) => hf('brAktNivni', e.target.value)}/>
                            </LabeledField>

                            <ToggleField
                                label="Реализирано"
                                value={searchForm.realizirano}
                                onChange={(v) => hf('realizirano', v)}
                                options={[
                                    {label: 'Да', value: 'true'},
                                    {label: 'Не', value: 'false'},
                                ]}
                            />

                            <LabeledField label="Испраќач">
                                <TextField fullWidth size="small" placeholder="Име на испраќач..."
                                           value={searchForm.isprakjacIme}
                                           sx={{m:0}}
                                           onChange={(e) => hf('isprakjacIme', e.target.value)}
                                           InputProps={{startAdornment: (
                                               <InputAdornment position="start"><PersonIcon sx={{fontSize: 17, color: '#AAA'}}/></InputAdornment>
                                           )}}/>
                            </LabeledField>

                            <LabeledField label="Одговорно лице">
                                <ColDropdownField
                                    value={searchForm.odgovornoLiceId}
                                    onChange={(v) => hf('odgovornoLiceId', v)}
                                    options={odgovornoLice || []}
                                    getLabel={(o) => `${o.ime} ${o.prezime}`}
                                    getId={(o) => o.id}
                                />
                            </LabeledField>

                            <LabeledField label="Доделено на">
                                <ColDropdownField
                                    value={searchForm.dodelenoNaId}
                                    onChange={(v) => hf('dodelenoNaId', v)}
                                    options={dodelenoNa || []}
                                    getLabel={(o) => `${o.ime} ${o.prezime}`}
                                    getId={(o) => o.id}
                                />
                            </LabeledField>

                            <LabeledField label="Број акт (архивски)">
                                <TextField fullWidth size="small" placeholder="Архивски акт..." sx={{m:0}}
                                           value={searchForm.brAktArhivski}
                                           onChange={(e) => hf('brAktArhivski', e.target.value)}/>
                            </LabeledField>

                            <LabeledField label="Извршил промена">
                                <TextField fullWidth size="small" placeholder="Корисник..." sx={{m:0}}
                                           value={searchForm.promenilKorisnik}
                                           onChange={(e) => hf('promenilKorisnik', e.target.value)}/>
                            </LabeledField>

                            <LabeledField label="Архива">
                                <ColDropdownField
                                    value={searchForm.arhivaId}
                                    onChange={(v) => hf('arhivaId', v)}
                                    options={arhiva || []}
                                    getLabel={(o) => o.naziv}
                                    getId={(o) => o.id}
                                />
                            </LabeledField>

                            <LabeledField label="Статус">
                                <ColDropdownField
                                    value={searchForm.statusPredmet}
                                    onChange={(v) => hf('statusPredmet', v)}
                                    options={statusPredmet?.map(s => ({id: s, naziv: s.replace(/_/g, ' ')})) || []}
                                    getLabel={(o) => o.naziv}
                                    getId={(o) => o.id}
                                />
                            </LabeledField>

                            <LabeledField label="Вид предмет (добиена)">
                                <ColDropdownField
                                    value={searchForm.vidPredmetDobienaId}
                                    onChange={(v) => hf('vidPredmetDobienaId', v)}
                                    options={vidPredmetD || []}
                                    getLabel={(o) => o.naziv}
                                    getId={(o) => o.id}
                                />
                            </LabeledField>

                            <LabeledField label="Вид предмет (испратена)">
                                <ColDropdownField
                                    value={searchForm.vidPredmetIspratenaId}
                                    onChange={(v) => hf('vidPredmetIspratenaId', v)}
                                    options={vidPredmetI || []}
                                    getLabel={(o) => o.naziv}
                                    getId={(o) => o.id}
                                />
                            </LabeledField>

                            <LabeledField label="Содржина">
                                <TextField fullWidth size="small" placeholder="Пребарај по содржина..."
                                           value={searchForm.sodrzina}
                                           sx={{m:0}}
                                           onChange={(e) => hf('sodrzina', e.target.value)}
                                           InputProps={{startAdornment: (
                                               <InputAdornment position="start"><DescriptionIcon sx={{fontSize: 17, color: '#AAA'}}/></InputAdornment>
                                           )}}/>
                            </LabeledField>

                            <LabeledField label="Забелешка">
                                <TextField fullWidth size="small" placeholder="Пребарај по забелешка..."
                                           sx={{m:0}}
                                           value={searchForm.zabeleska}
                                           onChange={(e) => hf('zabeleska', e.target.value)}
                                           InputProps={{startAdornment: (
                                               <InputAdornment position="start"><NotesIcon sx={{fontSize: 17, color: '#AAA'}}/></InputAdornment>
                                           )}}/>
                            </LabeledField>
                        </Box>

                        <Box sx={{
                            display: 'flex', justifyContent: 'flex-end', gap: 1.25,
                            px: {xs: 2, md: 3}, py: 1.75,
                            bgcolor: '#FAFAF9', borderTop: '1px solid #EEE',
                        }}>
                            <Button
                                variant="text"
                                startIcon={<ClearIcon sx={{fontSize: 16}}/>}
                                onClick={clearFilters}
                                disabled={activeFilterCount === 0 && !hasSearched}
                                sx={{textTransform: 'none', color: '#777', fontWeight: 500}}
                            >
                                Исчисти
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disableElevation
                                startIcon={<SearchIcon sx={{fontSize: 18}}/>}
                                sx={{
                                    textTransform: 'none', px: 3, fontWeight: 600,
                                    bgcolor: THEME.accent,
                                    '&:hover': {bgcolor: '#6b5a29'}
                                }}
                            >
                                Пребарај
                            </Button>
                        </Box>
                        </Collapse>
                    </Box>

                    {/* TABLE */}
                    {!hasSearched ? (
                        <Box sx={{p: 5, textAlign: 'center'}}>
                            <Typography sx={{color: '#999', fontSize: '0.9rem'}}>
                                Внесете филтри и кликнете „Пребарај“ за да ги видите предметите
                            </Typography>
                        </Box>
                    ) : (
                    <>
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
                                // table-layout: fixed - колоните ги почитуваат зададените
                                // width/minWidth/maxWidth без разлика на содржината, па не
                                // се прошируваат/собираат кога ќе се смени вредноста во филтерот.
                                tableLayout: 'fixed',
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
                                        {columns.map(({key, label, field, filter, minWidth}) => (
                                            <TableCell key={key}
                                                       sx={{
                                                           verticalAlign: 'top',
                                                           whiteSpace: 'nowrap',
                                                           borderBottom: 'none',
                                                           padding: '8px !important',
                                                           width: minWidth || 100,
                                                           minWidth: minWidth || 100,
                                                           maxWidth: minWidth || 100,
                                                       }}
                                            >
                                                <Box
                                                    onClick={() => field && handleSort(field)}
                                                    sx={{
                                                        display: 'flex', alignItems: 'center', gap: 0.3,
                                                        fontWeight: 'bold', color: '#fff',
                                                        cursor: field ? 'pointer' : 'default',
                                                        userSelect: 'none', mb: 0.6,
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <Box component="span" sx={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                        {label}
                                                    </Box>
                                                    {field && <SortIcon field={field} sort={sort}/>}
                                                </Box>
                                                {filter}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {pagedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length || 1} sx={{textAlign: 'center', py: 6}}>
                                                <Typography sx={{color: '#BBB', fontSize: '0.875rem'}}>
                                                    Нема пронајдени предмети
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : pagedData.map((predmet) => (
                                        <TableRow key={predmet.id}
                                                  sx={{
                                                      '&:hover': {bgcolor: 'lightgray'}, cursor: 'pointer',
                                                      '&:last-child td': {borderBottom: 'none'}
                                                  }}
                                                  onClick={() => navigate(`/posta/${predmet.id}`)}
                                        >
                                            {columns.map(({key, cell, minWidth}) => (
                                                <TableCell key={key} sx={{
                                                    py: 1,
                                                    width: minWidth || 100,
                                                    minWidth: minWidth || 100,
                                                    maxWidth: minWidth || 100,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                }}>
                                                    {cell(predmet)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    </>
                    )}

                    {/* ПРЕДУПРЕДУВАЊЕ - ако backend-от навистина има повеќе резултати од
                        големината на еден повик (100000), листата е намалена и не се сите. */}
                    {hasSearched && totalOnServer !== null && totalOnServer > allData.length && (
                        <Box sx={{
                            mt: 2, p: 1.5, bgcolor: '#FFF8E1',
                            border: '1px solid #FFE082', borderRadius: '6px'
                        }}>
                            <Typography sx={{color: '#8D6E00', fontSize: '0.8rem'}}>
                                Прикажани се само првите {allData.length.toLocaleString()} од вкупно {totalOnServer.toLocaleString()} резултати.
                                Стеснете ги филтрите за да ги видите сите.
                            </Typography>
                        </Box>
                    )}

                    {/* PAGINATION (клиентска, врз веќе превземените и филтрирани податоци) */}
                    {sortedData.length > 0 && totalPages > 1 && (
                        <Box sx={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', mt: 2
                        }}>
                            <Typography sx={{fontSize: '0.78rem', color: '#888'}}>
                                Прикажани {pagedData.length} од {sortedData.length} записи
                            </Typography>
                            <Pagination
                                count={totalPages}
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

// Заеднички стил за малите надписи над полињата во формата - сите полиња (текстуални, autocomplete,
// toggle) имаат ист "надпис одозгора + контрола" распоред за да се совпаѓаат по висина во мрежата.
const FIELD_LABEL_SX = {fontSize: '0.72rem', color: '#666', fontWeight: 500, mb: 0.5, ml: 0.1};

// Ги обвиткува обичните полиња (TextField/Autocomplete без сопствен label) со надпис одозгора,
// со ист изглед и висина како ToggleField и групата за датум - за подобро порамнување во мрежата.
const LabeledField = ({label, children, sx}) => (
    <Box sx={sx}>
        <Typography sx={FIELD_LABEL_SX}>{label}</Typography>
        {children}
    </Box>
);

// Сегментирана контрола (MUI ToggleButtonGroup) за филтри со точно 2 опции.
// Кликот на веќе избраната опција ја отповикува (враќа на "Сите").
const ToggleField = ({label, value, onChange, options}) => (
    <Box>
        <Typography sx={FIELD_LABEL_SX}>{label}</Typography>
        <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={value || null}
            onChange={(_, next) => onChange(next ?? '')}
            sx={{
                height: 40,
                '& .MuiToggleButton-root': {
                    textTransform: 'none', fontSize: '0.8rem', fontWeight: 600,
                    color: '#666', borderColor: 'rgba(0,0,0,0.23)',
                    '&.Mui-selected': {
                        bgcolor: THEME.accent, color: '#fff',
                        '&:hover': {bgcolor: '#6b5a29'},
                    },
                },
            }}
        >
            {options.map(opt => (
                <ToggleButton key={opt.value} value={opt.value}>
                    {opt.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    </Box>
);

// Autocomplete-базиран еквивалент на ColDropdown, за употреба во формата со филтри
// (дозволува и пребарување со пишување, не само избор од листа). Секогаш е обвиткан во
// LabeledField, па нема сопствен label - користи placeholder наместо тоа.
const ColDropdownField = ({value, onChange, options, getLabel, getId}) => {
    const selected = options.find(o => String(getId(o)) === String(value)) || null;
    return (
        <Autocomplete
            size="small"
            sx={{mt:-1}}
            options={options}
            value={selected}
            getOptionLabel={(o) => getLabel(o) ?? ''}
            isOptionEqualToValue={(o, v) => getId(o) === getId(v)}
            onChange={(_, newValue) => onChange(newValue ? getId(newValue) : '')}
            renderInput={(params) => <TextField {...params} placeholder="Сите"/>}
        />
    );
};

export default PredmetiList;
