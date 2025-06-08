import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  createUser,
  deleteUser,
  fetchUsers,
} from "../../services/UserServices";
import { deleteTour, fetchTours } from "../../services/TourServices"; // Add this import
import { toast } from "react-toastify";
import Badge from "../../components/ui/badge/Badge";
import { FaEdit, FaTimes, FaTrash, FaUserPlus } from "react-icons/fa";
import { register } from "../../services/AuthServices";
import { useSelector } from "react-redux";

const OwnerResponsableManagement = () => {
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [allTours, setAllTours] = useState([]); // Add tours state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    roles: ["responsable"], // Change default role to responsable
  });

  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both users and tours
        const [usersData, toursData] = await Promise.all([
          fetchUsers(),
          fetchTours(),
        ]);

        setAllTours(toursData); // Set all tours in state
        // Filter tours that belong to the current owner
        const ownerTours = toursData.filter(
          (tour) => tour.ownerId === currentUser.id
        );

        // Get unique responsable IDs from owner's tours
        const responsableIds = [
          ...new Set(ownerTours.map((tour) => tour.responsableId)),
        ];

        // Filter users who are responsables for owner's tours
        const responsables = usersData
          .filter((user) => responsableIds.includes(user.id))
          .map((user) => ({
            ...user,
            id: user.id.toString(),
          }));

        setTours(ownerTours);
        setUsers(responsables);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load data");
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser.id]);

  const handleDelete = async (userId) => {
    try {
      // First check if this responsable is assigned to any tours
      const isAssigned = tours.some((tour) => tour.responsableId === userId);

      if (isAssigned) {
        toast.error("Cannot delete responsable assigned to tours");
        return;
      }

      await deleteUser(userId);
      let delete_tour_id = tours.filter((el) => el.responsableId == userId)[0]
        ._id;
      await deleteTour(delete_tour_id);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success(
        "Responsable and corresponding tour has been deleted successfully"
      );
    } catch (error) {
      toast.error("Failed to delete responsable");
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (userId) => {
    navigate(`/update_responsable/${userId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading responsables...</div>;
  }

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await register(newUser);
      toast.success("Responsable created successfully");
      setIsModalOpen(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        roles: ["responsable"],
      });

      // Refresh data
      const [usersData, toursData] = await Promise.all([
        fetchUsers(),
        fetchTours(),
      ]);

      const ownerTours = toursData.filter(
        (tour) => tour.ownerId === currentUser.id
      );
      const responsableIds = [
        ...new Set(ownerTours.map((tour) => tour.responsableId)),
      ];

      const responsables = usersData
        .filter((user) => responsableIds.includes(user.id))
        .map((user) => ({
          ...user,
          id: user.id.toString(),
        }));

      setTours(ownerTours);
      setUsers(responsables);
    } catch (error) {
      toast.error("Failed to create responsable");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h1 className="text-center text-white text-3xl capitalize font-semibold py-4 ">
        Liste des Responsables
      </h1>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            <tr>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Username
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Email
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Showroom(Tour)
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Role
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.username}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email}
                  </td>

                  <td className="text-center px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {allTours.length > 0 &&
                      allTours.filter(
                        (tour) => tour.responsableId === user.id
                      )[0].tourName}
                  </td>

                  <td className="px-5 py-4 text-start">
                    <div className="flex gap-1">
                      {user.roles?.map((role) => (
                        <Badge
                          key={role}
                          size="sm"
                          color={
                            role === "admin"
                              ? "primary"
                              : role === "responsable"
                              ? "info"
                              : "success"
                          }
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-start">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-2xl hover:text-indigo-900 text-theme-sm flex items-center gap-1"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 text-white py-2 px-3 rounded-2xl hover:text-red-900 text-theme-sm flex items-center gap-1"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-5 py-4 text-center text-gray-500">
                  No responsables found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                Add New Responsable
              </h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <FaUserPlus />
                  Create Responsable
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full border border-gray-300 py-2 rounded mt-2 flex items-center justify-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerResponsableManagement;
