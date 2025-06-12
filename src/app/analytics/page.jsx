"use client";
import { useEffect, useState, useMemo } from "react";
import { startOfWeek, format } from "date-fns";
import Navbar from "@/components/navbar";
import useFetch from "@/hooks/useFetch";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import SideBar from "@/components/sidebar";

// Register chart types
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  TimeScale
);

const Analytics = ({ collapsed }) => {
  const [dateCounts, setDateCounts] = useState({});
  const [topAuthors, setTopAuthors] = useState([]);
  const [countryCounts, setCountryCounts] = useState({});
  const [sourceCounts, setSourceCounts] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const {
    data: fetchedData,
    loading,
    error,
  } = useFetch(
    `https://newsdata.io/api/1/latest?apikey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&country=us&prioritydomain=top`
  );

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (!fetchedData?.results) return;

    const dateMap = {};
    const authorMap = {};
    const countryMap = {};
    const sourceMap = {};

    fetchedData.results.forEach((item) => {
      const date = new Date(item.pubDate).toISOString().split("T")[0];
      dateMap[date] = (dateMap[date] || 0) + 1;

      (item.creator || ["Unknown"]).forEach((author) => {
        authorMap[author] = (authorMap[author] || 0) + 1;
      });

      (item.country || ["Unknown"]).forEach((country) => {
        countryMap[country] = (countryMap[country] || 0) + 1;
      });

      const source = item.source_name || "Unknown";
      sourceMap[source] = (sourceMap[source] || 0) + 1;
    });

    const sortedAuthors = Object.entries(authorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setDateCounts(dateMap);
    setTopAuthors(sortedAuthors);
    setCountryCounts(countryMap);
    setSourceCounts(sourceMap);
  }, [fetchedData]);

  const dateChartData = useMemo(
    () => ({
      labels: Object.keys(dateCounts),
      datasets: [
        {
          label: "Articles Published",
          data: Object.values(dateCounts),
          borderColor: "#36A2EB",
          backgroundColor: "#36A2EB",
          tension: 0.2,
        },
      ],
    }),
    [dateCounts]
  );

  const topAuthorData = useMemo(
    () => ({
      labels: topAuthors.map(([author]) => author),
      datasets: [
        {
          label: "Top 5 Authors",
          data: topAuthors.map(([_, count]) => count),
          backgroundColor: "rgba(255, 159, 64, 0.6)",
        },
      ],
    }),
    [topAuthors]
  );

  const countryChartData = useMemo(
    () => ({
      labels: Object.keys(countryCounts),
      datasets: [
        {
          label: "Articles by Country",
          data: Object.values(countryCounts),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    }),
    [countryCounts]
  );

  const sourceChartData = useMemo(
    () => ({
      labels: Object.keys(sourceCounts),
      datasets: [
        {
          label: "Source Popularity",
          data: Object.values(sourceCounts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#00A896",
          ],
        },
      ],
    }),
    [sourceCounts]
  );

  const typeWeekMap = {}; // { '2025-06-02': { sports: 4, politics: 2 }, ... }

  fetchedData?.results?.forEach((article) => {
    const rawDate = new Date(article.pubDate);
    const weekStart = format(
      startOfWeek(rawDate, { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    ); // Monday-start week
    const categories = article.category || ["Uncategorized"];

    categories.forEach((cat) => {
      if (!typeWeekMap[weekStart]) typeWeekMap[weekStart] = {};
      typeWeekMap[weekStart][cat] = (typeWeekMap[weekStart][cat] || 0) + 1;
    });
  });

  const weekLabels = Object.keys(typeWeekMap).sort();
  const allTypes = new Set();
  weekLabels.forEach((week) => {
    Object.keys(typeWeekMap[week]).forEach((type) => allTypes.add(type));
  });

  const weeklyChartData = {
    labels: weekLabels,
    datasets: Array.from(allTypes).map((type, i) => ({
      label: type,
      data: weekLabels.map((week) => typeWeekMap[week]?.[type] || 0),
      borderColor: `hsl(${i * 40}, 70%, 50%)`,
      backgroundColor: `hsla(${i * 40}, 70%, 50%, 0.1)`,
      tension: 0.3,
      fill: false,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
  };

  if (loading)
    return <div className="text-center py-10">Loading analytics...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-600">Error loading data.</div>
    );

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className={`flex sm:flex-col lg:flex-row min-h-screen  ${darkMode? "bg-gray-900 text-white": "bg-white text-black"}` }>
        <SideBar />
        <div>
          <main
            className={`flex-1 justify-center p-4 transition-all duration-300 ${
              collapsed ? "lg:pl-10" : "lg:pl-20"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-6 text-start">
              Analytics
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Articles Over Time</h3>
                <div
                  className={`relative sm:w-[200px] lg:w-[700px] h-[300px] shadow bg-white p-5 rounded
                ${
                  darkMode ? "bg-grey-800 text-white" : "bg-white text-gray-900"
                }`}
                >
                  {Object.keys(dateCounts).length > 0 ? (
                    <Line
                      data={weeklyChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "Weekly Article Count by Type",
                          },
                          legend: {
                            position: "bottom",
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Articles",
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: "Week Starting",
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <p>No article date data available.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Top 5 Authors</h3>
                <div className="relative lg:w-[500px] h-[300px] shadow bg-white p-5 rounded">
                  {topAuthors.length > 0 ? (
                    <Bar data={topAuthorData} options={chartOptions} />
                  ) : (
                    <p>No author data available.</p>
                  )}
                </div>
              </div>

              <div className="lg:flex sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Articles by Country
                  </h3>
                  <div className="relative sm:w-[200px] lg:w-[700px] h-[300px] shadow bg-white p-5 rounded">
                    {Object.keys(countryCounts).length > 0 ? (
                      <Bar data={countryChartData} options={chartOptions} />
                    ) : (
                      <p>No country data available.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Source Popularity
                  </h3>
                  <div className="relative lg:w-[500px] h-[300px] shadow bg-white p-5 rounded">
                    {Object.keys(sourceCounts).length > 0 ? (
                      <Pie data={sourceChartData} options={chartOptions} />
                    ) : (
                      <p>No source data available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Analytics;
