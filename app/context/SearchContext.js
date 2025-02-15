"use client";
import { createContext, useContext, useState } from "react";

// Create Search Context
const SearchContext = createContext({
  searchQuery: "",
  setSearchQuery: () => {},
});

// Custom Hook
export const useSearch = () => useContext(SearchContext);

// Provider Component
export default function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
