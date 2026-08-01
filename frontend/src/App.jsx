import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import LoginPage from "./UI/Pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./UI/Pages/Dashboard.jsx";
import PostaDetails from "./UI/Pages/DobienaPosta/PostaDetails.jsx";
import PredmetForm from "./UI/Pages/DobienaPosta/CreatePostaForm.jsx";
import Layout from "./components/Layout.jsx";
import {Box, Typography} from "@mui/material";
import PredmetiList from "./UI/Pages/PredmetList.jsx";
import {SnackbarProvider} from "./context/SnackbarContext.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SnackbarProvider>
                    <Routes>

                        {/* Јавни — без layout */}
                        <Route path="/login" element={<LoginPage/>}/>

                        <Route path="/forbidden" element={
                            <Box sx={{
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', minHeight: '100vh'
                            }}>
                                <Typography color="error" variant="h5">
                                    Немате пристап до оваа страница
                                </Typography>
                            </Box>
                        }/>

                        {/* Заштитени — со Layout */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Layout>
                                    <Dashboard/>
                                </Layout>
                            </ProtectedRoute>
                        }/>

                        <Route path="/createPosta/nova" element={
                            <ProtectedRoute>
                                <Layout>
                                    <PredmetForm/>
                                </Layout>
                            </ProtectedRoute>
                        }/>
                        <Route path="/predmeti" element={
                            <ProtectedRoute>
                                <Layout>
                                    <PredmetiList/>
                                </Layout>
                            </ProtectedRoute>
                        }
                        />
                        <Route path="/posta/:id" element={
                            <ProtectedRoute>
                                <Layout>
                                    <PostaDetails/>
                                </Layout>
                            </ProtectedRoute>
                        }/>

                        <Route path="/admin" element={
                            <ProtectedRoute roles={["ADMIN"]}>
                                <Layout>
                                    <div>Admin</div>
                                </Layout>
                            </ProtectedRoute>
                        }/>

                        <Route path="/" element={<Navigate to="/dashboard" replace/>}/>

                    </Routes>
                </SnackbarProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}