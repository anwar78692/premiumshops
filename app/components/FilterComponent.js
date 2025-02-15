"use client";

import { Button } from "@mui/material";
import { Filter } from "lucide-react";
import { useFilter } from "../context/FilterContext";
import { useTheme } from "../context/ThemeContext";

const filters = ["All", "Learning", "AI", "Professional", "Design", "Entertainment", "Utilities"];

export default function FilterComponent() {
  const { selectedFilter, setSelectedFilter } = useFilter();
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex items-center gap-3 p-5 w-full rounded-lg overflow-x-auto ${
        darkMode ? " text-white" : "bg-gray-100 text-black"
      }`}
    >
      <Filter size={20} />
      <span className="text-lg font-semibold">Filter by:</span>
      <div className="flex gap-2">
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
                  ? "#1E40AF" // Dark mode active color (Blue-700)
                  : "#3B82F6" // Light mode active color (Blue-500)
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
      </div>
    </div>
  );
}
