import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;