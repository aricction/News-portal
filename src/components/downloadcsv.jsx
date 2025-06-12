const downloadCSV = () => {
  const headers = ["Author", "Articles", "Rate", "Total"];
  const rows = authors.map((a) => [
    a.name,
    a.articles,
    a.rate,
    a.articles * a.rate,
  ]);

  const csvContent =
    [headers, ...rows]
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
