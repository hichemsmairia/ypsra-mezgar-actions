import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteTour, fetchTours } from "../../services/TourServices";
import { useSelector } from "react-redux";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlusCircle,
  FiLoader,
  FiMap,
} from "react-icons/fi";
import { FaBus, FaMapMarked } from "react-icons/fa";

const ResponsableTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setLoading(true);
    fetchTours()
      .then((result) => {
        setTours(result.filter((tour) => tour.responsableId === user.id));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (tourId) => {
    setTours(tours.filter((tour) => tour.id !== tourId));
    await deleteTour(tourId);
  };

  const handleUpdate = (tourId) => {
    navigate(`/update_tour/${tourId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-indigo-500 text-3xl" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
      <div className="flex justify-around items-center p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center space-x-3">
          <FaMapMarked className="text-2xl text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            My Tours
          </h1>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-white/[0.05]">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-3/4"
              >
                Tour Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-1/4"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-transparent divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tours.length > 0 ? (
              tours.map((tour) => (
                <tr
                  key={tour.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap w-3/4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                        {tour.tourName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdate(tour.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="mr-1" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900/30 dark:hover:bg-red-800/50 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="mr-1" />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={() => navigate("/view_tour/" + tour.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900/30 dark:hover:bg-green-800/50 transition-colors"
                        title="View"
                      >
                        <FiEye className="mr-1" />
                        <span>View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <FiMap className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-lg font-medium">No tours found</p>
                    <p className="text-sm mt-1">
                      Create your first tour to get started
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsableTours;
