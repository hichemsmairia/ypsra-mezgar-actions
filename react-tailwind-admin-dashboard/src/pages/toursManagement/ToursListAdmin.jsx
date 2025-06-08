import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteTour, fetchTours } from "../../services/TourServices";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPlus,
  FiSearch,
  FiLoader,
} from "react-icons/fi";
import {
  BsThreeDotsVertical,
  BsCheckCircleFill,
  BsExclamationCircleFill,
  BsCameraVideoFill,
  BsPerson,
} from "react-icons/bs";
import { BiCategoryAlt } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import { RiDashboardLine } from "react-icons/ri";
import { fetchUsers } from "../../services/UserServices";

const TourListAdmin = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchTours()
      .then((result) => {
        setTours(result);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (tourId) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      setTours(tours.filter((tour) => tour.id !== tourId));
      await deleteTour(tourId);
    }
  };

  const handleUpdate = (tourId) => {
    navigate(`/update_tour/${tourId}`);
  };

  const handlefetchUsers = async () => {
    try {
      await fetchUsers().then((result) => {
        setUsers(result);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    handlefetchUsers();
  }, []);

  const filteredTours = tours.filter((tour) =>
    tour.tourName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <FiLoader className="animate-spin text-3xl text-indigo-600" />
        <p className="text-gray-500">Loading tours...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <RiDashboardLine className="text-2xl text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Tour Management
            </h1>
          </div>
          <button
            onClick={() => navigate("/add_tour")}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <FiPlus className="mr-2" />
            Add New Tour
          </button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tours..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-medium">Total Tours</p>
              <p className="text-2xl font-bold text-gray-800">{tours.length}</p>
            </div>
            <BiCategoryAlt className="text-3xl text-indigo-400" />
          </div>
        </div>

        {/* Tours Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Tour Name
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Creator
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Created Date
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredTours.length > 0 ? (
                  filteredTours.map((tour) => (
                    <tr
                      key={tour.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                            <BsCameraVideoFill className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {tour.tourName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                            <BsPerson className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {users.length > 0 &&
                              users.filter((user) => user.id === tour.ownerId)
                                .length == 0
                                ? "Vous meme"
                                : users.length > 0 &&
                                  users.filter(
                                    (user) => user.id === tour.ownerId
                                  )[0].username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MdDateRange className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(tour.timeStamp).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate("/view_tour/" + tour.id)}
                            className="text-indigo-600 px-4 py-2 rounded-2xl bg-blue-500 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-2 hover:bg-indigo-50 dark:hover:bg-gray-700"
                            title="View"
                          >
                            <FiEye color="white" size={20} />
                          </button>
                          <button
                            onClick={() => handleUpdate(tour.id)}
                            className="text-blue-600 px-4 py-2 rounded-2xl bg-orange-500 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2  hover:bg-blue-50 dark:hover:bg-gray-700"
                            title="Edit"
                          >
                            <FiEdit2 color="white" size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(tour.id)}
                            className=" px-4 py-2 rounded-2xl bg-blue-200 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2  hover:bg-red-50 dark:hover:bg-gray-700"
                            title="Delete"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <FiSearch className="text-4xl text-gray-400 mb-3" />
                        <p className="text-gray-500">
                          No tours found matching your search
                        </p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourListAdmin;
