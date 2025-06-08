import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiCalendar, FiUsers, FiBarChart2 } from "react-icons/fi";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { fetchTours } from "../../services/TourServices.js";
import { useSelector } from "react-redux";

const OwnerMonthlyVisitChart = ({
  visitsData,
  chartHeight = 300,
  fontSize = "sm",
}) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [selectedTour, setSelectedTour] = useState("all");
  const [tourOptions, setTourOptions] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchTours();
        setTours(result.filter((tour) => tour.ownerId == user.id));

        if (visitsData && visitsData.length > 0) {
          // Extract tour IDs and create options
          const tourIds = Object.keys(visitsData[0]);
          const options = [
            { id: "all", name: "All Tours" },
            ...tourIds.map((tourId) => {
              const matchingTour = result.find((t) => t.id === tourId);
              return {
                id: tourId,
                name: matchingTour
                  ? matchingTour.tourName
                  : `Tour ${tourId.slice(-4)}`,
              };
            }),
          ];
          setTourOptions(options);
          processSelectedData("all", visitsData[0], result);
        }
      } catch (error) {
        console.error("Error loading tours:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [visitsData]);

  const processSelectedData = (
    tourId,
    data = visitsData?.[0],
    tourList = tours
  ) => {
    if (!data) return;

    let monthlyCounts;

    if (tourId === "all") {
      // Sum all tours' monthly visits
      monthlyCounts = Array(12).fill(0);
      Object.values(data).forEach((tourData) => {
        tourData.forEach((count, monthIdx) => {
          monthlyCounts[monthIdx] += count;
        });
      });
    } else {
      // Use specific tour's data
      monthlyCounts = data[tourId] || Array(12).fill(0);
    }

    // Process the monthly counts array
    const processedData = processMonthlyCounts(monthlyCounts);
    setMonthlyData(processedData);

    // Calculate total visits
    const total = monthlyCounts.reduce((sum, count) => sum + count, 0);
    setTotalVisits(total);

    // Calculate percentage change
    const nonZeroMonths = processedData.filter((month) => month.count > 0);
    if (nonZeroMonths.length >= 2) {
      const lastMonth = nonZeroMonths[nonZeroMonths.length - 1].count;
      const prevMonth = nonZeroMonths[nonZeroMonths.length - 2].count;
      const change =
        prevMonth !== 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : 100;
      setPercentageChange(parseFloat(change.toFixed(1)));
    } else {
      setPercentageChange(0);
    }
  };

  const handleTourChange = (e) => {
    const tourId = e.target.value;
    setSelectedTour(tourId);
    processSelectedData(tourId);
  };

  const processMonthlyCounts = (monthlyCounts) => {
    const currentYear = new Date().getFullYear();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return monthlyCounts.map((count, index) => ({
      monthYear: `${currentYear}-${String(index + 1).padStart(2, "0")}`,
      month: monthNames[index],
      year: currentYear.toString(),
      count: count,
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-700 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="font-semibold text-gray-800 dark:text-white/90">
            {label}
          </p>
          <p className="text-indigo-600 dark:text-indigo-300">
            <span className="font-medium">Visits:</span> {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="text-gray-800 dark:text-white/90 rounded-xl shadow-sm p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-center items-center h-64">
          Loading tour data...
        </div>
      </div>
    );
  }

  if (!visitsData || visitsData.length === 0) {
    return (
      <div className="text-gray-800 dark:text-white/90 rounded-xl shadow-sm p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-center items-center h-64">
          No visit data available
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-800 dark:text-white/90 rounded-xl shadow-sm p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center">
            <FiBarChart2 className="mr-2" /> Monthly Visits Overview
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedTour}
            onChange={handleTourChange}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {tourOptions.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.name}
              </option>
            ))}
          </select>

          <div className="p-3 rounded-lg">
            <div className="flex items-center">
              <FiUsers className="text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                Total Visits
              </span>
            </div>
            <p className="text-xl font-bold text-indigo-700 mt-1">
              {totalVisits}
            </p>
          </div>

          <div className="p-3 rounded-lg">
            <div className="flex items-center">
              <FiCalendar className="text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                Monthly Change
              </span>
            </div>
            <div className="flex items-center mt-1">
              {percentageChange >= 0 ? (
                <FaChevronUp className="text-green-500 mr-1" />
              ) : (
                <FaChevronDown className="text-red-500 mr-1" />
              )}
              <p
                className={`text-xl font-bold ${
                  percentageChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.abs(percentageChange)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="month"
              tick={{
                fill: "#6b7280",
                fontSize: fontSize === "sm" ? 10 : 12,
                className: "dark:text-white",
              }}
              axisLine={{ stroke: "#e5e7eb", strokeOpacity: 0.1 }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fill: "#6b7280",
                fontSize: fontSize === "sm" ? 10 : 12,
                className: "dark:text-white",
              }}
              axisLine={{ stroke: "#e5e7eb", strokeOpacity: 0.1 }}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperClassName="dark:bg-gray-700 dark:border-gray-600"
            />
            <Legend />
            <Bar
              dataKey="count"
              name="Visits"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-black text-sm dark:text-white flex items-center">
        <FiCalendar className="mr-2" />
        <span>Data for {new Date().getFullYear()}</span>
      </div>
    </div>
  );
};

export default OwnerMonthlyVisitChart;
