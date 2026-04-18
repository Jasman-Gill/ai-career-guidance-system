import { createContext, useContext, useMemo, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark" ? "dark" : "light";
  });
  const dark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      dark,
      setDark: (isDark) => setTheme(isDark ? "dark" : "light"),
    }),
    [theme, dark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}