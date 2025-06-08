import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from 'axios'
import { fetchUsersTypesCount } from "../../services/UserServices.js"
export default function UserTypePieChart() {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartOptions = {
    labels: labels,
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  useEffect(() => {
    const fetchUserTypeCounts = async () => {
      try {
        const response = await fetchUsersTypesCount()
        if (!response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response
        setSeries(Object.values(data));
        setLabels(Object.keys(data));
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchUserTypeCounts();
  }, []);

  if (loading) {
    return (
      <div>Chargement du graphique de répartition des utilisateurs...</div>
    );
  }

  if (error) {
    return <div>Erreur lors du chargement du graphique : {error}</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Répartition des Utilisateurs par Type
      </h3>
      <Chart options={chartOptions} series={series} type="pie" width="380" />
    </div>
  );
}
