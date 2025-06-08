import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchTours } from "../../services/TourServices";

const ToursListUser = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTours = async () => {
      try {
        const result = await fetchTours();
        setTours(result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load tours:", error);
        setLoading(false);
      }
    };
    loadTours();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm mx-4 my-6">
      <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
          Available Tours
        </h1>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Tour Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tours.map((tour) => (
              <tr
                key={tour.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/10"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {tour.tourName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate("/view_tour/" + tour.id)}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToursListUser;
