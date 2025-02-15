"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider, CssBaseline, createTheme, CircularProgress } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

// Create Theme Context
const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Custom Hook
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProviderWrapper({ children }) {
  const [darkMode, setDarkMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userUUID, setUserUUID] = useState(null);

  // ✅ Generate UUID if not available
  useEffect(() => {
    let storedUUID = localStorage.getItem("userUUID");

    if (!storedUUID) {
      storedUUID = uuidv4();
      localStorage.setItem("userUUID", storedUUID);
    }

    setUserUUID(storedUUID);
  }, []);

  // ✅ Fetch theme from database on mount
  useEffect(() => {
    if (!userUUID) return;

    async function fetchTheme() {
      try {
        const res = await fetch(`/api/theme?uuid=${userUUID}`);
        const data = await res.json();
        
        if (data.darkMode !== undefined) {
          setDarkMode(data.darkMode);
          localStorage.setItem("theme", data.darkMode ? "dark" : "light"); // ✅ Save to Local Storage
        }
      } catch (error) {
        console.error("Error fetching theme:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTheme();
  }, [userUUID]);

  // ✅ Toggle & Save theme
  const toggleDarkMode = async () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    try {
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: userUUID, darkMode: newTheme }),
      });
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  // ✅ Prevent rendering until theme is loaded
  if (loading || darkMode === null) {
    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
