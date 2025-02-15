"use client";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { darkMode } = useTheme(); // Get current theme

  return (
    <div
      className={`w-full flex justify-center pb-6 items-center px-5  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
     <TextField
        variant="outlined"
        placeholder="Search the products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{
          height: "44px",
          backgroundColor: darkMode ? "#1A2027" : "#fff",
          borderRadius: "18px", 
          "& .MuiOutlinedInput-root": {
            height: "44px", 
            padding: "0 12px", // Proper padding
            borderRadius: "10px", 
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
