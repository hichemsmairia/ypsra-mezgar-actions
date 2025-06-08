import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  BsFileBarGraph,
  BsPersonBadge,
  BsListUl,
  BsChevronDown,
  BsChevronRight,
  BsPeople,
  BsCameraVideoFill,
  BsBuildingCheck,
  BsPlusCircle,
  BsHouseDoor,
  BsGear,
  BsBoxSeam,
} from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const [userManagementOpen, setUserManagementOpen] = useState(
    pathname.includes("/users_list")
  );

  const [tourManagementOpen, setTourManagementOpen] = useState(true);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gradient-to-b from-indigo-900 to-indigo-800 dark:from-gray-900 dark:to-gray-800 border-r border-indigo-700 dark:border-gray-700 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 border-b border-indigo-700 dark:border-gray-700">
        <NavLink to="/">
          <h3 className="text-white text-center font-bold text-2xl flex items-center gap-2">
            <BsCameraVideoFill className="text-blue-300" />
            <span>Visite Virtuelle</span>
          </h3>
          <p className="text-xs text-blue-200 mt-1">Admin Dashboard</p>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-blue-200 hover:text-white"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L2.98748 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar Menu */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-6 px-4">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* Dashboard Link */}
              <li>
                <NavLink
                  to="/dashboard_admin"
                  className={`group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out ${
                    pathname === "/dashboard_admin"
                      ? "bg-white/10 text-white shadow-lg"
                      : "text-blue-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <RiDashboardLine
                    size={20}
                    className={`${
                      pathname === "/dashboard_admin"
                        ? "text-blue-300"
                        : "text-blue-200"
                    }`}
                  />
                  <span>Tableau de bord</span>
                  {pathname === "/dashboard_admin" && (
                    <span className="absolute right-4 h-2 w-2 rounded-full bg-blue-400"></span>
                  )}
                </NavLink>
              </li>

              {/* Users Management Link */}
              <li>
                <NavLink
                  to="/users_list"
                  className={`group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out ${
                    pathname.includes("/users_list")
                      ? "bg-white/10 text-white shadow-lg"
                      : "text-blue-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <BsPeople
                    size={20}
                    className={`${
                      pathname.includes("/users_list")
                        ? "text-purple-300"
                        : "text-purple-200"
                    }`}
                  />
                  <span>Gestion des utilisateurs</span>
                  {pathname.includes("/users_list") && (
                    <span className="absolute right-4 h-2 w-2 rounded-full bg-purple-400"></span>
                  )}
                </NavLink>
              </li>

              {/* Tours Management Link with Dropdown */}
              <li>
                <div
                  onClick={() => setTourManagementOpen(!tourManagementOpen)}
                  className={`group relative flex items-center justify-between gap-3 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out cursor-pointer ${
                    pathname.includes("/tours_list_admin") ||
                    pathname.includes("/add_tour")
                      ? "bg-white/10 text-white"
                      : "text-blue-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BsCameraVideoFill
                      size={20}
                      className={`${
                        pathname.includes("/tours_list_admin") ||
                        pathname.includes("/add_tour")
                          ? "text-amber-300"
                          : "text-amber-200"
                      }`}
                    />
                    <span>Gestion des Tours</span>
                  </div>
                  {tourManagementOpen ? (
                    <BsChevronDown size={14} className="text-blue-200" />
                  ) : (
                    <BsChevronRight size={14} className="text-blue-200" />
                  )}
                </div>

                {/* Dropdown Menu */}
                {tourManagementOpen && (
                  <ul className="mt-1 ml-2 pl-8 border-l-2 border-indigo-600/30">
                    <li className="mt-1">
                      <NavLink
                        to="/tours_list_admin"
                        className={`group relative flex items-center gap-3 rounded-lg py-2.5 px-4 text-sm font-medium duration-300 ease-in-out ${
                          pathname.includes("/tours_list_admin")
                            ? "bg-white/10 text-white"
                            : "text-blue-100 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <BsListUl
                          size={16}
                          className={`${
                            pathname.includes("/tours_list_admin")
                              ? "text-amber-300"
                              : "text-amber-200"
                          }`}
                        />
                        <span>Liste des Tours</span>
                        {pathname.includes("/tours_list_admin") && (
                          <span className="absolute right-4 h-2 w-2 rounded-full bg-amber-400"></span>
                        )}
                      </NavLink>
                    </li>
                    <li className="mt-1">
                      <NavLink
                        to="/add_tour"
                        className={`group relative flex items-center gap-3 rounded-lg py-2.5 px-4 text-sm font-medium duration-300 ease-in-out ${
                          pathname.includes("/add_tour")
                            ? "bg-white/10 text-white"
                            : "text-blue-100 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <BsPlusCircle
                          size={16}
                          className={`${
                            pathname.includes("/add_tour")
                              ? "text-green-300"
                              : "text-green-200"
                          }`}
                        />
                        <span>Ajouter un Tour</span>
                        {pathname.includes("/add_tour") && (
                          <span className="absolute right-4 h-2 w-2 rounded-full bg-green-400"></span>
                        )}
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto px-4 py-6 border-t border-indigo-700 dark:border-gray-700">
        <div className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/5 rounded-lg cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-sm font-medium">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-blue-200">Administrateur</p>
          </div>
          <FiLogOut
            onClick={() => {
              dispatch(logout());
              toast.warning("Vous avez été déconnecté.");
              setTimeout(() => {
                navigate("/");
              }, 2500);
            }}
            className="text-blue-200 hover:text-white"
          />
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
