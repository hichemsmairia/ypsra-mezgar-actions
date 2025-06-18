import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

import { ScrollToTop } from "./components/common/ScrollToTop";
import ToursList from "./pages/toursManagement/ToursList.jsx";
import AddTour from "./pages/toursManagement/AddTour.jsx";
import UpdateTour from "./pages/toursManagement/UpdateTour.jsx";
import UsersList from "./pages/usersManagement/UsersList.jsx";
import AddUser from "./pages/usersManagement/AddUser.jsx";
import UpdateUser from "./pages/usersManagement/UpdateUser.jsx";
// Importation des composants layout
import AdminLayout from "./layout/AdminLayout.tsx";
import OwnerLayout from "./layout/OwnerLayout.tsx";
import { ToastContainer } from "react-toastify";
import UserLayout from "./layout/UserLayout.tsx";
import ProtectedRoute from "./layout/ProtectedRoute.jsx";
import MyTours from "./pages/toursManagement/MyTours.jsx";
import ToursListAdmin from "./pages/toursManagement/ToursListAdmin.jsx";
import ToursListUser from "./pages/toursManagement/ToursListUser.jsx";
import TourViewer from "./pages/toursManagement/TourViewer.jsx";
import HomeAdmin from "./pages/Dashboard/HomeAdmin.tsx";
import HomeOwner from "./pages/Dashboard/HomeOwner.tsx";
import Home from "./pages/home/Home.jsx";
import OwnerResponsableManagement from "./pages/ownerResponsablesManagement/OwnerResponsableManagement.jsx";
import ToursListOwner from "./pages/toursManagement/ToursListOwner.jsx";
import ThemeInitializer from "../redux/ThemeInitializer.tsx";

export default function App() {
  return (
    <>
      <ToastContainer />
      <ThemeInitializer />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Others Page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "responsable", "owner", "USER"]}
              >
                <UserProfiles />
              </ProtectedRoute>
            }
          />
          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          {/* ADMIN Routes */}
          <Route
            path="/dashboard_admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout>
                  <HomeAdmin />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tours_list_admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "owner"]}>
                <AdminLayout>
                  <ToursListAdmin />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users_list"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout>
                  <UsersList />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add_user"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout>
                  <AddUser />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/update_user/:userId"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout>
                  <UpdateUser />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* OWNER Routes */}
          <Route
            path="/dashboard_owner"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerLayout>
                  <HomeOwner />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tours_list_owner"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerLayout>
                  <ToursListOwner />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add_tour"
            element={
              <ProtectedRoute allowedRoles={["owner", "ADMIN"]}>
                <AddTour />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update_tour/:tourId"
            element={
              <ProtectedRoute allowedRoles={["owner", "ADMIN"]}>
                <UpdateTour />
              </ProtectedRoute>
            }
          />
          owner_responsables_management
          <Route
            path="/my_tours"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerLayout>
                  <ToursListOwner />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner_responsables_management"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerLayout>
                  <OwnerResponsableManagement />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/view_tour/:tourId" element={<TourViewer />} />
          {/* user Routes */}
          <Route
            path="/tours_list_user"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <UserLayout>
                  <ToursListUser />
                </UserLayout>
              </ProtectedRoute>
            }
          />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
