import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./UI/Pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./UI/Pages/Dashboard.jsx";
import PostaDetails from "./UI/Pages/DobienaPosta/PostaDetails.jsx";
import PredmetForm from "./UI/Pages/DobienaPosta/CreatePostaForm.jsx";
import Layout from "./components/Layout.jsx";
import {Box, Typography} from "@mui/material";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Јавни — без layout */}
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/forbidden" element={
                        <Box sx={{display:'flex', alignItems:'center',
                            justifyContent:'center', minHeight:'100vh'}}>
                            <Typography color="error" variant="h5">
                                Немате пристап до оваа страница
                            </Typography>
                        </Box>
                    } />

                    {/* Заштитени — со Layout */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/createPosta/nova" element={
                        <ProtectedRoute roles={["OSL", "POMOSNIK", "ADMIN"]}>
                            <Layout>
                                <PredmetForm />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/posta/:id" element={
                        <ProtectedRoute>
                            <Layout>
                                <PostaDetails />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute roles={["ADMIN"]}>
                            <Layout>
                                <div>Admin</div>
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}