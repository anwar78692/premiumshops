"use client";

import { Button, useMediaQuery, Box, Typography, Paper, Select, MenuItem } from "@mui/material";
import { Filter } from "lucide-react";
import { useFilter } from "../context/FilterContext";
import { useTheme } from "../context/ThemeContext";
import React from "react";

const filters = ["All", "Learning", "AI", "Professional", "Productivity", "Design", "Entertainment", "Utilities", "Dating"];
const billingCycles = ["All", "Monthly", "Yearly", "3 Months", "6 Months"];

export default function FilterComponent() {
  const { selectedFilter, setSelectedFilter } = useFilter();
  const { darkMode } = useTheme();
  const isMobile = useMediaQuery("(max-width: 640px)"); // ✅ Detects mobile screens
  const [selectedBilling, setSelectedBilling] = React.useState("All");

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // paddingLeft: "20px",
        // paddingRight: "25px",
        overflowX: "auto",
        background: "transparent",
        boxShadow: "none",
        color: darkMode ? "#FFFFFF" : "#111827",

      }}
    >
      {/* Left Section - Filter Title & Icon */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Filter size={22} />
        
            <Typography variant="body1" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Filter by:
            </Typography>
          
        </Box>
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
      {isMobile ? (
        <Select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            minWidth: "150px",
            fontSize: "14px",
            backgroundColor: darkMode ? "#1E1E1E" : "#fff",
            color: darkMode ? "#E5E7EB" : "#000",
            borderRadius: "8px",
          }}
        >
          {filters.map((filter) => (
            <MenuItem key={filter} value={filter}>
              {filter}
            </MenuItem>
          ))}
        </Select>
      ) : (
        // 🔹 Desktop View: Filter Buttons
        <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "contained" : "outlined"}
              onClick={() => setSelectedFilter(filter)}
              sx={{
                borderRadius: "24px",
                textTransform: "none",
                padding: "6px 14px",
                minWidth: "80px",
                fontSize: "14px",
                whiteSpace: "nowrap",
                backgroundColor: selectedFilter === filter
                  ? darkMode
                    ? "#2563EB"
                    : "#3B82F6"
                  : "transparent",
                color: selectedFilter === filter
                  ? "#fff"
                  : darkMode
                  ? "#E5E7EB"
                  : "#374151",
                border: selectedFilter === filter ? "none" : `1px solid ${darkMode ? "#4B5563" : "#D1D5DB"}`,
                "&:hover": {
                  backgroundColor: selectedFilter === filter
                    ? darkMode
                      ? "#1E3A8A"
                      : "#2563EB"
                    : "rgba(0,0,0,0.05)",
                },
                transition: "all 0.3s ease-in-out",
              }}
            >
              {filter}
            </Button>
          ))}
        </Box>
      )}
      </Box>
    </Paper>
  );
}
