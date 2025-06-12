"use client";

import { useState, useEffect } from "react";
import AuthorPayoutTable from "@/components/payoutTable";
import PayoutCalculator from "./payoutcalulator";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);

const AdminPayoutSetter = () => {
  const [rate, setRate] = useState("");
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const storedRate = localStorage.getItem("payoutPerArticle");
    if (storedRate) {
      setRate(storedRate);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("payoutPerArticle", rate);
    alert("Payout rate saved!");
  };

  const downloadCSV = () => {
    const headers = ["Author", "Articles", "Rate", "Total"];
    const rows = authors.map((a) => [
      a.name,
      a.articles,
      a.rate,
      a.articles * a.rate,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "author_payouts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Author Payouts", 14, 16);

    const tableColumn = ["Author", "Articles", "Rate", "Total"];
    const tableRows = authors.map((a) => [
      a.name,
      a.articles,
      a.rate,
      a.articles * a.rate,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("author_payouts.pdf");
  };

  const router = useRouter();

  return (
    <div className="p-4 shadow-md mt-10 rounded max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h3 className="text-xl font-bold mb-2">Set Payout Rate</h3>
      <div className="flex items-center mb-4">
        <input
          type="number"
          placeholder="Enter ₹ per article"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Save
        </button>
      </div>

      <AuthorPayoutTable
        defaultRate={rate}
        setAuthors={setAuthors}
        downloadCSV={downloadCSV}
        downloadPDF={downloadPDF}
      />

      <PayoutCalculator
        rate={rate}
        totalArticles={authors.reduce((sum, a) => sum + a.articles, 0)}
      />
    </div>
  );
};

export default AdminPayoutSetter;
