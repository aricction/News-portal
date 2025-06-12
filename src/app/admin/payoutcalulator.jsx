"use client";
import { useState, useEffect } from "react";

const PayoutCalculator = ({ totalArticles = 0 }) => {
  const [payoutPerArticle, setPayoutPerArticle] = useState(0);

  useEffect(() => {
    const storedRate = localStorage.getItem("payoutPerArticle");
    if (storedRate) {
      setPayoutPerArticle(Number(storedRate));
    }
  }, []);

  const total = Number(totalArticles) * payoutPerArticle;

  return (
    <div className="p-4 shadow-md rounded mt-4">
      <p>Articles Written: {totalArticles}</p>
      <p>Payout per Article: ₹{payoutPerArticle}</p>
      <h3 className="text-lg font-bold mt-2">Total Payout: ₹{isNaN(total) ? 0 : total}</h3>
    </div>
  );
};

export default PayoutCalculator;
