// src/components/Dashboard/Sidebar.tsx

import { NavLink, useNavigate } from "react-router-dom";

type Role = "ADMIN" | "RECRUITER" | "CANDIDATE";

type SidebarProps = {
  role: Role;
};

type MenuItem = {
  name: string;
  path: string;
  icon: string;
};

const candidateMenus: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "bi bi-grid",
  },
  {
    name: "My Profile",
    path: "/dashboard/profile",
    icon: "bi bi-person",
  },
  {
    name: "My Attributes",
    path: "/dashboard/attributes",
    icon: "bi bi-card-list",
  },
  {
    name: "Projects",
    path: "/dashboard/projects",
    icon: "bi bi-kanban",
  },
  {
    name: "My CVs",
    path: "/dashboard/cvs",
    icon: "bi bi-file-earmark-person",
  },
  {
    name: "Available Positions",
    path: "/dashboard/positions",
    icon: "bi bi-briefcase",
  },
  {
    name: "Discussion",
    path: "/dashboard/discussion",
    icon: "bi bi-chat-dots",
  },
];

const recruiterMenus: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "bi bi-grid",
  },
  {
    name: "Positions",
    path: "/dashboard/positions",
    icon: "bi bi-briefcase",
  },
  {
    name: "Create Position",
    path: "/dashboard/create-position",
    icon: "bi bi-plus-circle",
  },
  {
    name: "Templates",
    path: "/dashboard/templates",
    icon: "bi bi-layout-text-window",
  },
  {
    name: "Attribute Library",
    path: "/dashboard/library",
    icon: "bi bi-collection",
  },
  {
    name: "Candidate CVs",
    path: "/dashboard/candidate-cvs",
    icon: "bi bi-file-earmark-text",
  },
  {
    name: "Discussion",
    path: "/dashboard/discussion",
    icon: "bi bi-chat-dots",
  },
];

const adminMenus: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "bi bi-grid",
  },
  {
    name: "Users",
    path: "/dashboard/users",
    icon: "bi bi-people",
  },
  {
    name: "Manage Roles",
    path: "/dashboard/roles",
    icon: "bi bi-person-gear",
  },
  {
    name: "Positions",
    path: "/dashboard/positions",
    icon: "bi bi-briefcase",
  },
  {
    name: "Templates",
    path: "/dashboard/templates",
    icon: "bi bi-layout-text-window",
  },
  {
    name: "Attribute Library",
    path: "/dashboard/library",
    icon: "bi bi-collection",
  },
  {
    name: "All CVs",
    path: "/dashboard/all-cvs",
    icon: "bi bi-file-earmark-person",
  },
  {
    name: "Statistics",
    path: "/dashboard/statistics",
    icon: "bi bi-bar-chart",
  },
];

export default function Sidebar({ role }: SidebarProps) {
  const navigate = useNavigate();

  let menus: MenuItem[] = [];

  if (role === "ADMIN") {
    menus = adminMenus;
  } else if (role === "RECRUITER") {
    menus = recruiterMenus;
  } else {
    menus = candidateMenus;
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside
      className="bg-dark text-white d-flex flex-column vh-100 shadow"
      style={{
        width: "270px",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div className="text-center border-bottom py-4">
        <h3 className="fw-bold text-info mb-0">
          CV Builder
        </h3>

        <small className="text-secondary">
          Recruitment Platform
        </small>
      </div>

      {/* Menu */}
      <div className="flex-grow-1 overflow-auto">
        <ul className="nav flex-column p-3">

          {menus.map((menu) => (
            <li
              className="nav-item mb-2"
              key={menu.path}
            >
              <NavLink
                to={menu.path}
                end
                className={({ isActive }) =>
                  `nav-link rounded px-3 py-2 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-light"
                  }`
                }
              >
                <i className={`${menu.icon} me-3`} />

                {menu.name}
              </NavLink>
            </li>
          ))}

        </ul>
      </div>

      {/* Bottom */}
      <div className="border-top p-3">

        <NavLink
          to="/dashboard/settings"
          className="nav-link text-light mb-3"
        >
          <i className="bi bi-gear me-3"></i>

          Settings
        </NavLink>

        <button
          onClick={handleLogout}
          className="btn btn-danger w-100"
        >
          <i className="bi bi-box-arrow-right me-2"></i>

          Logout
        </button>

      </div>
    </aside>
  );
}