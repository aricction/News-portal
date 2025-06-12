"use client";
import { useFilter } from "@/context/filterContext";
import { useEffect, useState } from "react";
import { BiCaretDown } from "react-icons/bi";

const Filters = ({ data }) => {
  const { filters, setFilters } = useFilter();
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data && data.results) {
      const uniqueAuthors = [
        ...new Set(data.results.map((item) => item.creator).filter(Boolean)),
      ];

      const uniqueCategories = [
        ...new Set(
          data.results.flatMap((item) => item.category || []).filter(Boolean)
        ),
      ];

      setAuthors(uniqueAuthors);
      setCategories(uniqueCategories);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex gap-4 flex-wrap">
      <div className="relative w-max">
        <select
          name="author"
          value={filters.author}
          onChange={handleChange}
          className="border px-4 py-2 rounded appearance-none pr-10"
        >
          <option value="">All Authors</option>
          {authors.map((author, index) => (
            <option key={index} value={author}>
              {author}
            </option>
          ))}
        </select>
        <BiCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600" />
      </div>

      <div className="relative w-max">
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="border px-4 py-2 rounded  appearance-none pr-10"
        >
          <option value="">All Types</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <BiCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600" />
      </div>
    </div>
  );
};

export default Filters;
