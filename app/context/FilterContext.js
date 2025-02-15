"use client";
import { createContext, useContext, useEffect, useState } from "react";

const FilterContext = createContext({
  selectedFilter: "All",
  selectedBillingCycle: "All", // ✅ Added Billing Cycle
  setSelectedFilter: () => {},
  setSelectedBillingCycle: () => {}, // ✅ Added function for Billing Cycle
});

export const useFilter = () => useContext(FilterContext);

export default function FilterProvider({ children }) {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("All"); // ✅ Billing Cycle State

  useEffect(() => {
    async function fetchFilter() {
      try {
        const res = await fetch("/api/filter");
        const data = await res.json();
        if (data.selectedFilter) {
          setSelectedFilter(data.selectedFilter);
        }
        if (data.selectedBillingCycle) {  // ✅ Fetching Billing Cycle
          setSelectedBillingCycle(data.selectedBillingCycle);
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

  const updateBillingCycle = async (billingCycle) => {
    setSelectedBillingCycle(billingCycle);
    try {
      await fetch("/api/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedBillingCycle: billingCycle }), // ✅ Save Billing Cycle Filter
      });
    } catch (error) {
      console.error("Error updating billing cycle:", error);
    }
  };

  return (
    <FilterContext.Provider 
      value={{ 
        selectedFilter, 
        setSelectedFilter: updateFilter, 
        selectedBillingCycle,  // ✅ Provide Billing Cycle
        setSelectedBillingCycle: updateBillingCycle, // ✅ Provide Billing Cycle Update Function
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
