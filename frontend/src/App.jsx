import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./UI/Pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./UI/Pages/Dashboard.jsx";
import DobienaPostaForm from "./UI/Pages/DobienaPosta/CreatePostaForm.jsx";
import TESTFORMA from "./UI/Pages/TEST slicna forma.jsx";
import PostaDetails from "./UI/Pages/DobienaPosta/PostaDetails.jsx";
import CreatePostaForm from "./UI/Pages/DobienaPosta/CreatePostaForm.jsx";
import PredmetForm from "./UI/Pages/DobienaPosta/CreatePostaForm.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Јавни рути */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/TEST" element={<TESTFORMA/>}/>
                    {/* Заштитени рути — сите логирани */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    {/* Форма за добиена пошта */}
                    <Route path="/createPosta/nova" element={
                        <ProtectedRoute roles={["OSL", "POMOSNIK", "ADMIN"]}>
                            <PredmetForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/posta/:id" element={
                        <ProtectedRoute roles={["OSL", "POMOSNIK", "ADMIN"]}>
                            <PostaDetails />
                        </ProtectedRoute>
                    }
                           />

                    {/* Само за ADMIN */}
                    <Route path="/admin" element={
                        <ProtectedRoute roles={["ADMIN"]}>
                            {/*<AdminPage />*/}
                        </ProtectedRoute>
                    } />

                    {/* Само за NACALNIK и ADMIN */}
                    <Route path="/workflow" element={
                        <ProtectedRoute roles={["NACALNIK_SEK", "NACALNIK_ODD", "ADMIN"]}>
                            {/*<WorkflowPage />*/}
                        </ProtectedRoute>
                    } />

                    {/* Default — пренасочи кон dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Forbidden страница */}
                    <Route path="/forbidden" element={
                        <div className="min-h-screen flex items-center justify-center">
                            <p className="text-red-500 text-xl">Немате пристап до оваа страница</p>
                        </div>
                    } />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}