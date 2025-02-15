"use client";

import { Button, useMediaQuery, Box, Typography } from "@mui/material";
import { Filter } from "lucide-react";
import { useFilter } from "../context/FilterContext";
import { useTheme } from "../context/ThemeContext";

const filters = ["All", "Learning", "AI", "Professional", "Design", "Entertainment", "Utilities"];

export default function FilterComponent() {
  const { selectedFilter, setSelectedFilter } = useFilter();
  const { darkMode } = useTheme();
  const isMobile = useMediaQuery("(max-width: 640px)"); // ✅ Detects mobile screens

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "12px",
        width: "100%",
        borderRadius: "8px",
        overflowX: "auto",
        backgroundColor: darkMode ? "#121212" : "#F3F4F6",
        color: darkMode ? "#FFFFFF" : "#000000",
      }}
    >
      {/* ✅ Fix: Ensure Filter icon is visible */}
      <Box sx={{ display: "flex", alignItems: "center", color: "inherit" }}>
        <Filter size={22} />
      </Box>

      {/* ✅ Show only on larger screens */}
      {!isMobile && (
        <Typography variant="body1" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
          Filter by:
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1 }}>
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "contained" : "outlined"}
            color={selectedFilter === filter ? "primary" : "default"}
            onClick={() => setSelectedFilter(filter)}
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              padding: "6px 16px",
              minWidth: "80px",
              backgroundColor: selectedFilter === filter
                ? darkMode
                  ? "#1E40AF" // Dark mode active color
                  : "#3B82F6" // Light mode active color
                : "transparent",
              color: selectedFilter === filter ? "#fff" : darkMode ? "#D1D5DB" : "#374151",
              borderColor: selectedFilter === filter
                ? "transparent"
                : darkMode
                ? "#4B5563"
                : "#D1D5DB",
              "&:hover": {
                backgroundColor: selectedFilter === filter
                  ? darkMode
                    ? "#1E3A8A"
                    : "#2563EB"
                  : "transparent",
              },
            }}
          >
            {filter}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
