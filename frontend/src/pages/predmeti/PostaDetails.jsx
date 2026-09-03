import {useState, useEffect, useRef} from 'react';
import {
    Box, Typography,
    Button, Chip, CircularProgress,
    Card, CardContent, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import InboxIcon from '@mui/icons-material/Inbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import {useNavigate, useParams} from "react-router-dom";
import usePredmetDetails from "../../hooks/usePredmetiDetails.js";
import useArhiva from "../../hooks/useArhiva.js";
import useVidPredmetDobieno from "../../hooks/useVidPredmetDobieno.js";
import useVidPredmetIspratena from "../../hooks/useVidPredmetIspratena.js";
import useUsersOdgovornoLice from "../../hooks/useUsersOdgovornoLice.js";
import {useAuth} from "../../context/AuthContext.jsx";
import useOrgEdinica from "../../hooks/useOrgEdinica.js";
import usePredmeti from "../../hooks/usePredmeti.js";
import {formatStatus} from "../../utils/formatters.js";
import {predmetiApi as dokumentiApi} from "../../api/predmeti.js";
import {renderAsync as renderDocxAsync} from "docx-preview";
import * as XLSX from "xlsx";

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
    labelColor: '#8B6914',
    valueBg: '#fff',
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
    labelColor: '#1B5E20',
    valueBg: '#fff',
};

// ─── РЕД ОД ПОЛИЊА - исто како во CreatePostaForm ───────────────────────────────
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

// ─── ПРОСТО ПОЛЕ (само за читање) - надпис одозгора + вредност во рамка ─────────
const DetailField = ({label, value, sx}) => (
    <Box sx={sx}>
        <Typography sx={{
            fontSize: '0.7rem', color: '#888', fontWeight: 600,
            letterSpacing: '0.06em', mb: 0.8, textTransform: 'uppercase'
        }}>
            {label}
        </Typography>
        <Box sx={{
            border: '1px solid #D8D8D8', borderRadius: '8px', px: 1.5, minHeight: 40,
            display: 'flex', alignItems: 'center', bgcolor: '#fff'
        }}>
            <Typography sx={{fontSize: '0.85rem', color: value ? '#222' : '#BBB'}}>
                {value || '—'}
            </Typography>
        </Box>
    </Box>
);

// ─── ВИШЕЗНАЧНО ПОЛЕ (chips) - за читање ────────────────────────────────────────
const DetailChipsField = ({label, items, getLabel, theme, sx}) => (
    <Box sx={sx}>
        <Typography sx={{
            fontSize: '0.7rem', color: '#888', fontWeight: 600,
            letterSpacing: '0.06em', mb: 0.8, textTransform: 'uppercase'
        }}>
            {label}
        </Typography>
        <Box sx={{
            border: '1px solid #D8D8D8', borderRadius: '8px', px: 1.2, py: 0.8, minHeight: 40,
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, bgcolor: '#fff'
        }}>
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
    </Box>
);

// ─── МУЛТИЛИНИСКО ПОЛЕ (Содржина/Забелешка) - за читање ─────────────────────────
const DetailTextArea = ({label, value, minHeight, sx}) => (
    <Box sx={sx}>
        <Typography sx={{
            fontSize: '0.7rem', color: '#888', fontWeight: 600,
            letterSpacing: '0.06em', mb: 0.8, textTransform: 'uppercase'
        }}>
            {label}
        </Typography>
        <Box sx={{
            border: '1px solid #D8D8D8', borderRadius: '8px', px: 1.5, py: 1.2, minHeight,
            bgcolor: '#fff'
        }}>
            <Typography sx={{
                fontSize: '0.85rem', color: value ? '#222' : '#BBB',
                whiteSpace: 'pre-wrap', lineHeight: 1.6
            }}>
                {value || '—'}
            </Typography>
        </Box>
    </Box>
);

// ─── СЕГМЕНТИРАН ПРИКАЗ (Тип/Приоритет) - исто како ToggleField, но само за читање ──
const DetailToggle = ({label, value, options, theme}) => (
    <Box>
        <Typography sx={{
            fontSize: '0.7rem', color: '#888', fontWeight: 600,
            letterSpacing: '0.06em', mb: 0.8, textTransform: 'uppercase'
        }}>
            {label}
        </Typography>
        <Box sx={{display: 'flex', border: '1px solid rgba(0,0,0,0.23)', borderRadius: '8px', overflow: 'hidden'}}>
            {options.map((opt, i) => {
                const selected = opt === value;
                return (
                    <Box key={opt} sx={{
                        flex: 1, textAlign: 'center', py: 0.9, fontSize: '0.8rem', fontWeight: 600,
                        color: selected ? '#fff' : '#666',
                        bgcolor: selected ? theme.accentDark : 'transparent',
                        borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.23)' : 'none',
                    }}>
                        {opt}
                    </Box>
                );
            })}
        </Box>
    </Box>
);

// ─── ПРИКАЗ НА ДА/НЕ (Информативна пошта/Реализирано) - иста структура (надпис
// одозгора + рамка) како и другите Detail* полиња, за да се порамнат во истиот ред.
const DetailSwitch = ({label, checked, theme}) => (
    <Box>
        <Typography sx={{
            fontSize: '0.7rem', color: '#888', fontWeight: 600,
            letterSpacing: '0.06em', mb: 0.8, textTransform: 'uppercase'
        }}>
            {label}
        </Typography>
        <Box sx={{
            border: `1px solid ${checked ? theme.border : '#D8D8D8'}`,
            borderRadius: '8px', px: 1.5, minHeight: 40,
            display: 'flex', alignItems: 'center',
            bgcolor: checked ? theme.chipBg : '#fff',
        }}>
            <Typography sx={{
                fontSize: '0.85rem', fontWeight: 600,
                color: checked ? theme.accentDark : '#BBB'
            }}>
                {checked ? 'Да' : 'Не'}
            </Typography>
        </Box>
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
    const {arhiva} = useArhiva();
    const {vidPredmetD} = useVidPredmetDobieno();
    const {vidPredmetI} = useVidPredmetIspratena();
    const {odgovornoLice} = useUsersOdgovornoLice();
    const {user} = useAuth();
    const {getOrgEdinicaById} = useOrgEdinica();
    const {getPrethodniPredmeti, getDoc} = usePredmeti();

    const [orgEdinica, setOrgEdinica] = useState(null);
    const [prethodni, setPrethodni] = useState([]);
    const [loadingPrethodni, setLoadingPrethodni] = useState(false);
    const [loadingDok, setLoadingDok] = useState(false);

    const [dokumenti, setDokumenti] = useState([]);

    // Преглед на документ (Dialog) - blob URL (слики/PDF), вистински рендериран
    // .docx преку docx-preview (изгледа идентично како кога документот ќе се преземе
    // и отвори во Word - страници, маргини, фонтови), или Excel (.xls/.xlsx) преку
    // SheetJS (xlsx) - секој лист (sheet) се рендерира како HTML табела.
    const [previewDoc, setPreviewDoc] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewDocxBlob, setPreviewDocxBlob] = useState(null);
    const [previewExcelSheets, setPreviewExcelSheets] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState(false);
    const docxContainerRef = useRef(null);

    // Word - новиот .docx (OOXML) формат целосно се рендерира преку docx-preview.
    // Стариот бинарен .doc формат нема доверлива JS библиотека за преглед во прелистувач,
    // затоа за него само се овозможува преземање (истото важи и за легацискиот .xls
    // формат ако SheetJS не успее да го парсира - многу стари/оштетени фајлови).
    const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const DOC_MIME = 'application/msword';
    const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const XLS_MIME = 'application/vnd.ms-excel';
    const EXCEL_MIMES = [XLSX_MIME, XLS_MIME];

    const openPreview = async (dok) => {
        setPreviewDoc(dok);
        setPreviewLoading(true);
        setPreviewError(false);
        setPreviewUrl(null);
        setPreviewDocxBlob(null);
        setPreviewExcelSheets(null);
        try {
            const blob = await dokumentiApi.getDokBlob(dok.id);
            if (dok.tipFile === DOCX_MIME) {
                setPreviewDocxBlob(blob);
            } else if (EXCEL_MIMES.includes(dok.tipFile)) {
                const arrayBuffer = await blob.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, {type: 'array'});
                const sheets = workbook.SheetNames.map(name => ({
                    name,
                    html: XLSX.utils.sheet_to_html(workbook.Sheets[name], {id: undefined, editable: false}),
                }));
                setPreviewExcelSheets(sheets);
            } else {
                setPreviewUrl(URL.createObjectURL(blob));
            }
        } catch {
            setPreviewError(true);
        } finally {
            setPreviewLoading(false);
        }
    };

    // Откако blob-от на .docx е превземен и контејнерот е монтиран во DOM-от,
    // docx-preview го рендерира внатре во него - со вистинска пагинација.
    useEffect(() => {
        if (previewDocxBlob && docxContainerRef.current) {
            docxContainerRef.current.innerHTML = '';
            renderDocxAsync(previewDocxBlob, docxContainerRef.current, undefined, {
                className: 'docx-preview-content',
                inWrapper: true,
                ignoreWidth: false,
                ignoreHeight: false,
                // Word автоматски вметнува lastRenderedPageBreak таму каде страницата
                // природно се пренела (без рачен page break) - без ова, docx-preview
                // го игнорира тоа и целата содржина завршува во еден "прв" контејнер
                // со фиксна висина, па остатокот од страниците исчезнува/се сече.
                ignoreLastRenderedPageBreak: false,
            }).catch(() => setPreviewError(true));
        }
    }, [previewDocxBlob]);

    const closePreview = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setPreviewDocxBlob(null);
        setPreviewExcelSheets(null);
        setPreviewDoc(null);
    };

    useEffect(() => {
        if (predmet?.id) {
            dokumentiApi.getAll(predmet.id).then(setDokumenti);
        }
    }, [predmet?.id]);
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
    useEffect(() => {
        setLoadingDok(true);
        getDoc(id)
            .then(res => setDokumenti(res || []))
            .finally(() => setLoadingDok(false));
    }, [id]);
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

    const odgovornoLiceList = (odgovornoLice || []).filter(u => predmet.odgovornoLiceId?.includes(u.id));
    const arhivaList = (arhiva || []).filter(a => predmet.arhivaId?.includes(a.id));
    const vidPredmetList = isDobiena
        ? (vidPredmetD || []).filter(v => predmet.vidPredmetDobienaId?.includes(v.id))
        : (vidPredmetI || []).filter(v => predmet.vidPredmetIspratenaId?.includes(v.id));

    const brojNaAkt = `${predmet.brAkt} / ${predmet.redenBroj} / ${predmet.podBroj} / ${predmet.godina}`;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{p: 3}}>

                <Card sx={{
                    borderRadius: '12px', overflow: 'hidden',
                    border: '1px solid #E4E4E4', boxShadow: '0 1px 3px rgba(16,24,40,0.05)'
                }}>

                    {/* ── ЕДИНСТВЕН НАСЛОВ НА КАРТИЧКАТА ── */}
                    <Box sx={{
                        background: T.gradient, px: {xs: 2, md: 3}, py: 1.75,
                        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                        justifyContent: 'space-between', gap: 1,
                    }}>
                        <Typography sx={{color: '#fff', fontWeight: 700, fontSize: '1.05rem'}}>
                            {isDobiena ? 'Добиена пошта' : 'Испратена пошта'} — Детали на предмет
                        </Typography>
                        <Typography sx={{
                            color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem',
                            fontFamily: 'monospace', letterSpacing: '0.02em'
                        }}>
                            Број на акт: {brojNaAkt}
                        </Typography>
                    </Box>

                    <CardContent sx={{p: {xs: 2, md: 3}}}>

                        {/* ── СИТЕ ПОЛИЊА ВО РЕДОВИ, ИСТО КАКО ВО CreatePostaForm ── */}
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>

                            {/* РЕД 1: Датум на заведување, Тип, Приоритет, Испраќач, [Друг испраќач] */}
                            <FormRow>
                                <DetailField label="Датум на заведување" value={predmet.datumZaveduvanje}/>
                                <DetailToggle label="Тип" value={predmet.tipPosta} options={['писмо', 'телеграма']}
                                              theme={T}/>
                                {isDobiena && (
                                    <DetailToggle label="Приоритет" value={predmet.prioritet}
                                                  options={['Висок', 'Нормален']} theme={T}/>
                                )}
                                <DetailField label={isDobiena ? 'Испраќач' : 'Примач'} value={predmet.isprakjacIme}/>
                                {/*<DetailField label="Друг испраќач" value={predmet.isprakjacIme}*/}
                                {/*             sx={{visibility: isDrugo ? 'visible' : 'hidden'}}/>*/}
                            </FormRow>

                            {/* РЕД 2: Број на акт (нивни), Број на акт (архивски), Датум на испраќање */}
                            {isDobiena && (
                                <FormRow>
                                    <DetailField label="Број на акт (нивни)" value={predmet.brAktNivni}/>
                                    <DetailField label="Број на акт (архивски)" value={predmet.brAktArhivski}/>
                                    <DetailField label="Датум на испраќање" value={predmet.datumIsprakjanje}/>
                                </FormRow>
                            )}

                            {/* РЕД 3: Вид на предмет, Информативна пошта, Реализирано */}
                            <FormRow columns="2fr 1fr 1fr" sx={{ alignItems: 'center' }}>
                                <DetailChipsField label="Вид на предмет" items={vidPredmetList}
                                                  getLabel={(v) => v.naziv} theme={T}/>
                                <DetailSwitch label="Информативна пошта" checked={predmet.informativnaPosta}
                                              theme={T}/>
                                <DetailSwitch label="Реализирано" checked={predmet.realizirano} theme={T}/>
                            </FormRow>

                            {/* РЕД 4: Содржина */}
                            <DetailTextArea label="Содржина" value={predmet.sodrzina} minHeight={100}/>

                            {/* РЕД 5: Одговорно лице, Архива */}
                            <FormRow columns="1fr 1fr">
                                <DetailChipsField label="Одговорно лице" items={odgovornoLiceList}
                                                  getLabel={(u) => `${u.ime} ${u.prezime}`} theme={T}/>
                                <DetailChipsField label="Архива" items={arhivaList}
                                                  getLabel={(a) => a.naziv} theme={T}/>
                            </FormRow>

                            {/* РЕД 6: Забелешка (80%), Статус на предмет (20%) */}
                            <FormRow columns="4fr 1fr">
                                <DetailTextArea label="Забелешка" value={predmet.zabeleska} minHeight={64}/>
                                <DetailField label="Статус на предмет" value={formatStatus(predmet.statusPredmet)}/>
                            </FormRow>
                        </Box>

                        {dokumenti.length > 0 && (
                            <>
                                <Divider sx={{my: 2.5}}/>
                                <Typography sx={{
                                    fontSize: '0.7rem', color: '#888', fontWeight: 600,
                                    letterSpacing: '0.06em', mb: 1, textTransform: 'uppercase'
                                }}>
                                    Скенирани документи
                                </Typography>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.8}}>
                                    {dokumenti.map(dok => (
                                        <Box key={dok.id} sx={{
                                            display: 'flex', alignItems: 'center', gap: 1,
                                            px: 1.5, py: 0.8, bgcolor: '#fff',
                                            border: '1px solid #EAEAEA', borderRadius: '6px',
                                            cursor: 'pointer',
                                            '&:hover': {bgcolor: T.chipBg}
                                        }}
                                             onClick={() => openPreview(dok)}
                                        >
                                            <DescriptionIcon sx={{fontSize: 16, color: T.accent}}/>
                                            <Typography sx={{fontSize: '0.8rem', flex: 1, color: '#444'}}>
                                                {dok.imeFile}
                                            </Typography>
                                            <Typography sx={{fontSize: '0.68rem', color: '#999'}}>
                                                {dok.tipFile}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        )}

                        {(loadingPrethodni || prethodni.length > 0) && (
                            <>
                                <Divider sx={{my: 2.5}}/>
                                <Typography sx={{
                                    fontSize: '0.7rem', color: '#888', fontWeight: 600,
                                    letterSpacing: '0.06em', mb: 1, textTransform: 'uppercase'
                                }}>
                                    Историја на предмет
                                </Typography>
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
                                                    'Бр. акт (нивни)', 'Испраќач', 'Извр. промена', 'Одговорно лице',
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
                                                            {p.promenilKorisnik || '—'}
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
                            </>
                        )}
                    </CardContent>

                    {/* ── ФУТЕР СО КОПЧИЊА ── */}
                    <Box sx={{
                        display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center',
                        px: {xs: 2, md: 3}, py: 2, bgcolor: '#FAFAF9', borderTop: '1px solid #EEE',
                    }}>
                        <Button
                            variant="contained"
                            disableElevation
                            startIcon={<EditIcon sx={{fontSize: 15}}/>}
                            onClick={() => navigate(`/createPosta/edit/${predmet.id}?tipDelovnik=${predmet.tipDelovnik}`)}
                            sx={{
                                bgcolor: T.btnBg, color: '#fff', fontWeight: 600,
                                fontSize: '0.75rem', textTransform: 'none', px: 2, py: 0.7,
                                borderRadius: '8px',
                                '&:hover': {bgcolor: T.btnHover}
                            }}
                        >
                            Уреди
                        </Button>
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
                </Card>

                {/* ── PREVIEW НА ДОКУМЕНТ ── */}
                <Dialog open={!!previewDoc} onClose={closePreview} maxWidth="md" fullWidth
                        PaperProps={{sx: {borderRadius: '12px', overflow: 'hidden'}}}>
                    <DialogTitle sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        bgcolor: T.chipBg, py: 1.5
                    }}>
                        <DescriptionIcon sx={{fontSize: 18, color: T.accentDark}}/>
                        <Typography sx={{flex: 1, fontSize: '0.9rem', fontWeight: 600, color: T.accentDark}}>
                            {previewDoc?.imeFile}
                        </Typography>
                        <IconButton size="small" onClick={closePreview}>
                            <CloseIcon sx={{fontSize: 18}}/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{p: 0, bgcolor: '#F5F5F5', minHeight: 300, display: 'flex'}}>
                        {previewLoading ? (
                            <Box sx={{
                                flex: 1, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', minHeight: 300
                            }}>
                                <CircularProgress size={32} sx={{color: T.accent}}/>
                            </Box>
                        ) : previewUrl && previewDoc?.tipFile?.startsWith('image/') ? (
                            <Box component="img" src={previewUrl} alt={previewDoc.imeFile}
                                 sx={{maxWidth: '100%', maxHeight: '80vh', m: 'auto', display: 'block'}}/>
                        ) : previewUrl && previewDoc?.tipFile === 'application/pdf' ? (
                            <Box component="iframe" src={previewUrl} title={previewDoc.imeFile}
                                 sx={{width: '100%', height: '80vh', border: 'none'}}/>
                        ) : previewDoc?.tipFile === DOCX_MIME && !previewError ? (
                            <Box
                                ref={docxContainerRef}
                                sx={{
                                    width: '100%', maxHeight: '80vh', overflowY: 'auto',
                                    py: 2, display: 'flex', justifyContent: 'center',
                                    '& .docx-preview-content': {bgcolor: 'transparent'},
                                    '& .docx-wrapper': {
                                        bgcolor: 'transparent', display: 'flex',
                                        flexDirection: 'column', alignItems: 'center', gap: '16px',
                                    },
                                    '& .docx-wrapper > section': {
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                    },
                                }}
                            />
                        ) : previewExcelSheets && !previewError ? (
                            <Box sx={{
                                width: '100%', maxHeight: '80vh', overflow: 'auto', p: 2,
                            }}>
                                {previewExcelSheets.map((sheet) => (
                                    <Box key={sheet.name} sx={{mb: 3}}>
                                        {previewExcelSheets.length > 1 && (
                                            <Typography sx={{
                                                fontSize: '0.8rem', fontWeight: 700, color: T.accentDark,
                                                mb: 0.75, px: 0.5,
                                            }}>
                                                {sheet.name}
                                            </Typography>
                                        )}
                                        <Box sx={{
                                            bgcolor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                            overflowX: 'auto', p: 1,
                                            '& table': {borderCollapse: 'collapse', fontSize: '0.8rem'},
                                            '& td, & th': {border: '1px solid #ddd', padding: '4px 8px', whiteSpace: 'nowrap'},
                                        }}
                                             dangerouslySetInnerHTML={{__html: sheet.html}}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{
                                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', gap: 1, minHeight: 300, p: 3
                            }}>
                                <DescriptionIcon sx={{fontSize: 40, color: '#CCC'}}/>
                                <Typography sx={{fontSize: '0.85rem', color: '#888', textAlign: 'center'}}>
                                    {previewError
                                        ? 'Прегледот не успеа да се вчита за овој документ.'
                                        : previewDoc?.tipFile === DOC_MIME
                                            ? 'Прегледот не е достапен за стариот .doc формат.'
                                            : `Прегледот не е достапен за овој тип документ (${previewDoc?.tipFile}).`}
                                    {' '}Преземете го за да го отворите.
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{px: 2.5, py: 1.5, borderTop: '1px solid #EEE'}}>
                        <Button onClick={closePreview} sx={{textTransform: 'none', color: '#666'}}>
                            Затвори
                        </Button>
                        <Button
                            variant="contained" disableElevation
                            startIcon={<DownloadIcon sx={{fontSize: 16}}/>}
                            onClick={() => dokumentiApi.downloadDok(previewDoc.id, previewDoc.imeFile)}
                            sx={{
                                textTransform: 'none', bgcolor: T.btnBg,
                                '&:hover': {bgcolor: T.btnHover}
                            }}
                        >
                            Преземи
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
};

export default PostaDetails;
