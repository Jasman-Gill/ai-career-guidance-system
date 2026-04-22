import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analysis";
import Career from "./pages/Career";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Roadmap from "./pages/Roadmap";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./context/ThemeContext";

function hasUserSession() {
    try {
        return Boolean(JSON.parse(localStorage.getItem("user")));
    } catch {
        return false;
    }
}

function ProtectedRoutes() {
    return hasUserSession() ? <Outlet /> : <Navigate to="/login" replace />;
}

function AuthRoutes() {
    return hasUserSession() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    <Route element={<AuthRoutes />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Register />} />
                    </Route>

                    <Route element={<ProtectedRoutes />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/career" element={<Career />} />
                        <Route path="/roadmap" element={<Roadmap />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
