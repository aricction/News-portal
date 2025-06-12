"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import useFetch from "@/hooks/useFetch";
import Searchbar from "@/components/searchbar";
import Filters from "@/components/filters";
import { useFilter } from "@/context/filterContext";
import SideBar from "@/components/sidebar";
import Image from "next/image";

export default function Dashboard({ collapsed }) {
  const { data, loading, error } = useFetch(
    `https://newsdata.io/api/1/latest?apikey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&country=us&prioritydomain=top`
  );

  const { searchQuery, filters } = useFilter();
  const [darkMode, setDarkMode] = useState(false);

  const filteredData = data?.results?.filter((article) => {
    const lowerQuery = searchQuery.toLowerCase();

    const titleMatch = article.title?.toLowerCase().includes(lowerQuery);
    const descriptionMatch = article.description
      ?.toLowerCase()
      .includes(lowerQuery);
    const authorMatch = article.creator?.some((a) =>
      a.toLowerCase().includes(lowerQuery)
    );
    const categoryMatch = article.category?.some((c) =>
      c.toLowerCase().includes(lowerQuery)
    );
    const sourceMatch = article.source_id?.toLowerCase().includes(lowerQuery);

    const queryMatch =
      titleMatch ||
      descriptionMatch ||
      authorMatch ||
      categoryMatch ||
      sourceMatch;

    const filterAuthorMatch = filters.author
      ? article.creator?.includes(filters.author)
      : true;

    const filterTypeMatch = filters.type
      ? article.category?.includes(filters.type)
      : true;

    let dateMatch = true;
    if (filters.startDate || filters.endDate) {
      const articleDate = new Date(article.pubDate);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      if (startDate && articleDate < startDate) dateMatch = false;
      if (endDate && articleDate > endDate) dateMatch = false;
    }

    return queryMatch && filterAuthorMatch && filterTypeMatch && dateMatch;
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <>
      <div
        className={
          darkMode
            ? "bg-gray-900 text-white min-h-screen"
            : "bg-gray-200 text-black min-h-screen"
        }
      >
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <div className="flex">
          {/* Sidebar */}
          <SideBar isDark={darkMode} />

          {/* Main Content */}
          <div className="flex-1 p-5 sm:p-10">
            <div className="flex justify-end mb-4">
              <Searchbar />
            </div>

            <hr className="border border-gray-300 mb-6" />

            <main
              className={`flex flex-col gap-8 transition-all duration-300 ${
                collapsed ? "lg:pl-10" : "lg:pl-20"
              }`}
            >
              {" "}
              <h1 className="text-3xl font-bold">Welcome to the News Portal</h1>
              <Filters data={data} />
              {loading && <p>Loading ...</p>}
              {error && (
                <p className="text-red-600">
                  Error:{" "}
                  {error?.results?.message ||
                    error?.message ||
                    "Something went wrong."}
                </p>
              )}{" "}
              {!loading && filteredData?.length > 0 && (
                <ul className="grid gap-4">
                  {filteredData.map((article, index) => (
                    <li
                      key={index}
                      className={`p-5 shadow rounded-md ${
                        darkMode
                          ? "text-white border"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {article.title || article.link}
                      </a>
                      <p className="text-orange-500">{article.category}</p>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {article.description?.length > 100
                          ? `${article.description.slice(0, 100)}...`
                          : article.description}
                      </p>

                      <p className="text-xs text-gray-400">{article.pubDate}</p>

                      {article.image_url && (
                        <div className="mt-2">
                          <img
                            src={article.image_url}
                            loading="lazy"
                            alt="article"
                            className="w-full h-auto max-h-64 object-cover rounded"
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </main>

            <footer className="text-center text-sm text-gray-500 mt-16">
              © 2025 News Portal. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
