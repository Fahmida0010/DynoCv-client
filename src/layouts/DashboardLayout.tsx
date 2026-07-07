
// src/layouts/DashboardLayout.tsx

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";

// Temporary user data
// Later replace with Auth Context / Redux / API
const user = {
  name: "John Doe",
  email: "john@example.com",
  role: "CANDIDATE" as "ADMIN" | "RECRUITER" | "CANDIDATE",
};

export default function DashboardLayout() {
  return (
    <div className="d-flex">

      {/* Sidebar */}
      <Sidebar role={user.role} />

      {/* Main Content */}
      <div
        className="flex-grow-1 bg-light"
        style={{
          minHeight: "100vh",
        }}
      >

        {/* Top Navbar */}
        <header
          className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center"
        >
          <div>
            <h4 className="fw-bold mb-0">
              Dashboard
            </h4>

            <small className="text-muted">
              Welcome back 👋
            </small>
          </div>

          <div className="d-flex align-items-center gap-3">

            {/* Notification */}
            <button
              className="btn btn-light position-relative"
            >
              <i className="bi bi-bell fs-5"></i>

              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                3
              </span>
            </button>

            {/* User */}
            <div className="d-flex align-items-center">

              <img
                src="https://i.pravatar.cc/100"
                alt="Profile"
                className="rounded-circle"
                width={45}
                height={45}
              />

              <div className="ms-3">
                <h6 className="mb-0 fw-bold">
                  {user.name}
                </h6>

                <small className="text-muted">
                  {user.role}
                </small>
              </div>

            </div>

          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
