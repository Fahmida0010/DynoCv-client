import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "../Logo/Logo";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  photo?: string;
};

const Navbar = () => {
  // Replace with Auth Context
  const [user, setUser] = useState<User | null>({
    firstName: "Fahmida",
    lastName: "Akter",
    email: "fahmida@gmail.com",
    role: "CANDIDATE",
    photo: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">

        <Logo />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >

          <ul className="navbar-nav mx-auto text-center">

            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/positions">
                Positions
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>

          </ul>

          {!user ? (
            <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">

              <Link
                to="/login"
                className="btn btn-outline-primary"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
              >
                Register
              </Link>

            </div>
          ) : (
            <div className="dropdown d-flex justify-content-center justify-content-lg-end mt-3 mt-lg-0">

              <button
                type="button"
                className="btn p-0 border-0 bg-transparent dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Profile"
                    className="rounded-circle"
                    width="45"
                    height="45"
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "45px",
                      height: "45px",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {user.firstName.charAt(0)}
                  </div>
                )}
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow"
                style={{ minWidth: "260px" }}
              >
                <li className="px-3 py-3">
                  <h6 className="mb-1">
                    {user.firstName} {user.lastName}
                  </h6>

                  <small className="text-muted">
                    {user.email}
                  </small>

                  <div className="mt-2">
                    <span className="badge bg-primary">
                      {user.role}
                    </span>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                  >
                    My Profile
                  </Link>
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>

              </ul>

            </div>
          )}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;