import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../src/context/ThemeContext";

const readStoredUser = () => {
    try {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
};

function Navbar() {
    const { dark, setDark } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(() => readStoredUser());
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const displayName = user?.name || user?.email || "User";
    const initials = displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("analysis");
        setIsMenuOpen(false);
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        const handleUserUpdate = () => {
            setUser(readStoredUser());
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("storage", handleUserUpdate);
        window.addEventListener("userUpdated", handleUserUpdate);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("storage", handleUserUpdate);
            window.removeEventListener("userUpdated", handleUserUpdate);
        };
    }, []);

    return (
        <div className="flex justify-between items-center px-6 py-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl border-b border-gray-200 dark:border-white/20">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Career Guide
            </h1>

            <div className="flex items-center gap-2">
                <label className="switch cursor-pointer" title={dark ? "Switch to light mode" : "Switch to dark mode"}>
                    <input
                        type="checkbox"
                        checked={dark}
                        onChange={() => setDark(!dark)}
                        aria-label="Toggle theme"
                    />
                    <span className="slider" />
                    <span className="clouds_stars" />
                </label>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="flex items-center justify-center rounded-full p-1 bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                        <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-semibold flex items-center justify-center">
                            {initials || "U"}
                        </div>
                    </button>

                    {isMenuOpen ? (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-white/20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-lg overflow-hidden z-50">
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {displayName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-300">Account</p>
                            </div>

                            <div className="p-1.5">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/profile?tab=settings"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Profile Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Navbar;