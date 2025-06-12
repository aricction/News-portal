"use client";

import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

const AuthorPayoutTable = ({ defaultRate, setAuthors: setParentAuthors , downloadCSV , downloadPDF}) => {
  const { data, loading, error } = useFetch(
    `https://newsdata.io/api/1/latest?apikey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&country=us&prioritydomain=top`
  );

  const [authors, setLocalAuthors] = useState([]);

  useEffect(() => {
    // Simulate/fake author info from fetched articles
    if (data?.results && Array.isArray(data.results)) {
      const enriched = data.results.slice(0, 5).map((item, index) => {
        const name = item.creator?.[0] || `Author ${index + 1}`;
        const articles = Math.floor(Math.random() * 10) + 1; // Simulated count
        const savedRate = localStorage.getItem(`rate-${name}`);
        return {
          name,
          articles,
          rate: savedRate ? Number(savedRate) : Number(defaultRate) || 100,
        };
      });

      setLocalAuthors(enriched);
      setParentAuthors(enriched); // Sync with parent
    }
  }, [data, defaultRate]);

  const handleRateChange = (index, newRate) => {
    const updated = [...authors];
    updated[index].rate = Number(newRate);
    setLocalAuthors(updated);
    localStorage.setItem(`rate-${updated[index].name}`, newRate);
    setParentAuthors(updated); // Keep parent in sync
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Failed to load authors.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Author Payouts</h2>
     
     <div className="flex mb-4 gap-2">
  <button
    onClick={downloadCSV}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Download CSV
  </button>
  <button
    onClick={downloadPDF}
    className=" rounded-md bg-blue-400 dark:bg-dark-50 px-6 py-3 font-medium text-white"
  >
    Download PDF
  </button>
</div>

      <table className="w-full   shadow rounded overflow-hidden">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-3">Author</th>
            <th className="p-3">Articles</th>
            <th className="p-3">₹ / Article</th>
            <th className="p-3">Total Payout</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author, index) => (
            <tr key={author.name} className="border-t border-gray-200">
              <td className="p-3">{author.name}</td>
              <td className="p-3">{author.articles}</td>
              <td className="p-3">
                <input
                  type="number"
                  value={author.rate}
                  onChange={(e) => handleRateChange(index, e.target.value)}
                  className="w-20 border px-2 py-1 rounded"
                />
              </td>
              <td className="p-3 font-semibold">
                ₹{author.articles * author.rate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorPayoutTable;
