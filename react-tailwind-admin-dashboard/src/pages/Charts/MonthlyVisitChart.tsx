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

const MonthlyVisitsChart = ({
  visitsData,
  chartHeight = 300,
  fontSize = "sm",
}) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    if (visitsData) {
      // Get the first (and only) key in the object
      const key = Object.keys(visitsData)[0];
      const monthlyCounts = visitsData[key];

      // Process the monthly counts array
      const processedData = processMonthlyCounts(monthlyCounts);
      setMonthlyData(processedData);

      // Calculate total visits
      const total = monthlyCounts.reduce((sum, count) => sum + count, 0);
      setTotalVisits(total);

      // Calculate percentage change (compare last non-zero month with previous)
      const nonZeroMonths = processedData.filter((month) => month.count > 0);
      if (nonZeroMonths.length >= 2) {
        const lastMonth = nonZeroMonths[nonZeroMonths.length - 1].count;
        const prevMonth = nonZeroMonths[nonZeroMonths.length - 2].count;
        const change =
          prevMonth !== 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : 100;
        setPercentageChange(parseFloat(change.toFixed(1)));
      }
    }
  }, [visitsData]);

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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-800 dark:text-white/90">
            {label}
          </p>
          <p className="text-indigo-600">
            <span className="font-medium">Visits:</span> {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="text-gray-800 dark:text-white/90 rounded-xl shadow-sm p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center">
            <FiBarChart2 className="mr-2" /> Monthly Visits Overview
          </h2>
          <p className="text-sm text-gray-500">Evolution of visits over time</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className=" p-3 rounded-lg">
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

          <div className=" p-3 rounded-lg">
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

      <div className={`h-[${chartHeight}px]`}>
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
                className: "dark:text-white", // Add dark mode text color
              }}
              axisLine={{ stroke: "#e5e7eb", strokeOpacity: 0.1 }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fill: "#6b7280",
                fontSize: fontSize === "sm" ? 10 : 12,
                className: "dark:text-white", // Add dark mode text color
              }}
              axisLine={{ stroke: "#e5e7eb", strokeOpacity: 0.1 }}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperClassName="dark:bg-gray-700 dark:border-gray-600"
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e5e7eb",
                borderRadius: "0.5rem",
                dark: {
                  backgroundColor: "#374151",
                  borderColor: "#4b5563",
                },
              }}
            />
            <Legend
              wrapperStyle={{
                color: "#6b7280",
                dark: {
                  color: "white",
                },
              }}
            />
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

export default MonthlyVisitsChart;
