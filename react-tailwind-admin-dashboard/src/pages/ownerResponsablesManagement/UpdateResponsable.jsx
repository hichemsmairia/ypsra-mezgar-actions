import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchUserById, updateUser } from "../../services/UserServices";
import { toast } from "react-toastify";
import Badge from "../../components/ui/badge/Badge";

const UpdateResponsable = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    roles: [],
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await fetchUserById(userId);
        setFormData({
          username: user.username,
          email: user.email,
          password: "",
          roles: user.roles,
        });
        setInitialLoad(false);
      } catch (error) {
        toast.error("Failed to load user data");
        navigate("/users_list");
      }
    };
    loadUserData();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(userId, formData);
      toast.success("User updated successfully");
      navigate("/owner_responsables_management");
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
          mettre a jour un responsable
        </h1>
        <div className="flex gap-2">
          {formData.roles.map((role) => (
            <Badge
              key={role}
              size="sm"
              color={
                role === "admin"
                  ? "primary"
                  : role === "user"
                  ? "success"
                  : "info"
              }
              variant="light"
            >
              {role}
            </Badge>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-white/90"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-white/90"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password (leave blank to keep current)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-white/90"
            placeholder="Enter new password"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/owner_responsables_management")}
            className="px-5 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center min-w-32"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateResponsable;
