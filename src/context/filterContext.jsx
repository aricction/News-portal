"use client";
import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ filteredResults , setFilteredResults] = useState([]);
  const [filters, setFilters] = useState({
    author: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  return (
    <FilterContext.Provider value={{ searchQuery, setSearchQuery, filters, setFilters, filteredResults , setFilteredResults }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
