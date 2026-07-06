import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    InputAdornment,
    IconButton,
    Paper
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';

// Color palette matching image_636f29.png
const COLORS = {
    goldHeader: '#C1A460',
    sectionBorder: '#B83239',
    bgSectionHeader: '#CBAE6C',
    grayText: '#666666',
    photoBg: '#F0EDED',
};

const TESTFORMA=()=> {
    // State for sample components
    const [consent, setConsent] = useState(true);
    const [dateEntry, setDateEntry] = useState(null);
    const [dateInterview, setDateInterview] = useState(dayjs('2026-06-15'));
    const [dob, setDob] = useState(null);
    const [military, setMilitary] = useState(false);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="xl" sx={{ bgcolor: '#FAF9F6', py: 2, minHeight: '100vh' }}>

                {/* TOP MAIN HEADER */}
                <Box sx={{ bgcolor: COLORS.goldHeader, p: 1, mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: '500', fontSize: '1.1rem' }}>
                        MAIN HEADER
                    </Typography>
                </Box>

                {/* ========================================== */}
                {/* SECTION 1: CONSENT */}
                {/* ========================================== */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ bgcolor: COLORS.bgSectionHeader, px: 2, py: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                            SECTION
                        </Typography>
                    </Box>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 0, borderTop: 'none', borderColor: '#E0E0E0' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.goldHeader },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.goldHeader }
                                    }}
                                />
                            }
                            label="ON / OFF"
                            sx={{ color: '#333', fontWeight: '500', display: 'block', mb: 1 }}
                        />
                        {consent && <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 28 }} />}
                    </Paper>
                </Box>

                {/* ========================================== */}
                {/* SECTION 2: DATA REGISTRATION AND CONSENT */}
                {/* ========================================== */}
                <Box sx={{ mb: 3, border: `1px solid ${COLORS.sectionBorder}`, borderRadius: '4px', overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: COLORS.bgSectionHeader, px: 2, py: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                            SECTION
                        </Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: '#fff' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <DatePicker
                                    label="DATE OF ENTRY"
                                    value={dateEntry}
                                    onChange={(newValue) => setDateEntry(newValue)}
                                    slotProps={{ textField: { fullWidth: true, size: 'small', variant: 'outlined' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth size="small" label="Interview location" variant="outlined" placeholder="Interview location" InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DatePicker
                                    label="DATE OF INTERVIEW"
                                    value={dateInterview}
                                    onChange={(newValue) => setDateInterview(newValue)}
                                    slotProps={{ textField: { fullWidth: true, size: 'small', variant: 'standard', helperText: '' } }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField fullWidth size="small" label="Person conducting the interview / interviewer (Organization and name)" variant="outlined" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth size="small" label="Translator (name)" variant="outlined" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Translation language</InputLabel>
                                    <Select label="Translation language" defaultValue="" endAdornment={
                                        <InputAdornment position="end" sx={{ mr: 2 }}><IconButton size="small"><SearchIcon fontSize="small" /></IconButton></InputAdornment>
                                    }>
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                        <MenuItem value="en">English</MenuItem>
                                        <MenuItem value="mk">Macedonian</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Interview modality</InputLabel>
                                    <Select label="Interview modality" defaultValue="" endAdornment={
                                        <InputAdornment position="end" sx={{ mr: 2 }}><IconButton size="small"><SearchIcon fontSize="small" /></IconButton></InputAdornment>
                                    }>
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                        <MenuItem value="in-person">In-Person</MenuItem>
                                        <MenuItem value="remote">Remote</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {/* ========================================== */}
                {/* SECTION 3: PERSONAL DATA */}
                {/* ========================================== */}
                <Box sx={{ mb: 3, border: `1px solid ${COLORS.sectionBorder}`, borderRadius: '4px', overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: COLORS.bgSectionHeader, px: 2, py: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                            PERSONAL DATA
                        </Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: '#fff' }}>
                        <Grid container spacing={2}>

                            {/* Left Column: Photo Placeholder */}
                            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                                <Box sx={{
                                    width: '100%',
                                    minHeight: '140px',
                                    bgcolor: COLORS.photoBg,
                                    border: '1px dashed #ccc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: COLORS.grayText,
                                    borderRadius: '4px'
                                }}>
                                    <Typography variant="body2">Photo of the person</Typography>
                                </Box>
                            </Grid>

                            {/* Right Column Grid: Core Identification Info */}
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="FIRST NAME" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="ORIGINAL FIRST NAME" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="LAST NAME" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="ORIGINAL LAST NAME" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DatePicker
                                            label="DATE OF BIRTH"
                                            value={dob}
                                            onChange={(newValue) => setDob(newValue)}
                                            slotProps={{ textField: { fullWidth: true, size: 'small', variant: 'outlined' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>GENDER</InputLabel>
                                            <Select label="GENDER" defaultValue="">
                                                <MenuItem value=""><em>Select</em></MenuItem>
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Continuing Fields Below Photo Row */}
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Country of origin</InputLabel>
                                    <Select label="Country of origin" defaultValue="">
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth size="small" label="PLACE OF RESIDENCE" variant="outlined" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth size="small" label="ETHNIC AFFILIATION" variant="outlined" />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>FAMILY STATUS</InputLabel>
                                    <Select label="FAMILY STATUS" defaultValue="" endAdornment={
                                        <InputAdornment position="end" sx={{ mr: 2 }}><IconButton size="small"><SearchIcon fontSize="small" /></IconButton></InputAdornment>
                                    }>
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={9}>
                                <TextField fullWidth size="small" label="Other accompanying family members:" variant="outlined" />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>RELIGION</InputLabel>
                                    <Select label="RELIGION" defaultValue="" endAdornment={
                                        <InputAdornment position="end" sx={{ mr: 2 }}><IconButton size="small"><SearchIcon fontSize="small" /></IconButton></InputAdornment>
                                    }>
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>EDUCATION</InputLabel>
                                    <Select label="EDUCATION" defaultValue="" endAdornment={
                                        <InputAdornment position="end" sx={{ mr: 2 }}><IconButton size="small"><SearchIcon fontSize="small" /></IconButton></InputAdornment>
                                    }>
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth size="small" label="PROFESSION" variant="outlined" />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField fullWidth size="small" label="The work you did in your home country" variant="outlined" />
                            </Grid>

                            {/* Military Switch Section */}
                            <Grid item xs={12} sx={{ mt: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={military}
                                            onChange={(e) => setMilitary(e.target.checked)}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.goldHeader },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.goldHeader }
                                            }}
                                        />
                                    }
                                    label="SERVED IN THE MILITARY"
                                    sx={{ color: '#333', fontWeight: 'bold' }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>DOCUMENTS</InputLabel>
                                    <Select label="DOCUMENTS" defaultValue="" endAdornment={
                                        <InputAdornment position="end" sx={{ mr: 2 }}><IconButton size="small"><SearchIcon fontSize="small" /></IconButton></InputAdornment>
                                    }>
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>VULNERABILITY</InputLabel>
                                    <Select label="VULNERABILITY" defaultValue="">
                                        <MenuItem value=""><em>Select</em></MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {/* Footer App Version Branding */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                        app 1.2.0
                    </Typography>
                </Box>

            </Container>
        </LocalizationProvider>
    );
}
export default TESTFORMA;