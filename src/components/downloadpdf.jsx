import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const downloadPDF = () => {
  const doc = new jsPDF();
  doc.text("Author Payouts", 14, 10);

  autoTable(doc, {
    head: [["Author", "Articles", "Rate", "Total"]],
    body: authors.map((a) => [
      a.name,
      a.articles,
      a.rate,
      a.articles * a.rate,
    ]),
    startY: 20,
  });

  doc.save("author_payouts.pdf");
};
