"use client";
import { createContext, useContext, useEffect, useState } from "react";

const FilterContext = createContext({
  selectedFilter: "All",
  setSelectedFilter: () => {},
});

export const useFilter = () => useContext(FilterContext);

export default function FilterProvider({ children }) {
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    async function fetchFilter() {
      try {
        const res = await fetch("/api/filter");
        const data = await res.json();
        if (data.selectedFilter) {
          setSelectedFilter(data.selectedFilter);
        }
      } catch (error) {
        console.error("Error fetching filter:", error);
      }
    }
    fetchFilter();
  }, []);

  const updateFilter = async (filter) => {
    setSelectedFilter(filter);
    try {
      await fetch("/api/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedFilter: filter }),
      });
    } catch (error) {
      console.error("Error updating filter:", error);
    }
  };

  return (
    <FilterContext.Provider value={{ selectedFilter, setSelectedFilter: updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
}
