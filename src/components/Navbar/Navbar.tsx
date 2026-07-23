import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
      <div className="container-fluid px-4 px-lg-5">
        
        <Logo />

        {/* Mobile Toggler Button */}
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

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* me-lg-auto ব্যবহারের ফলে বড় স্ক্রিনে এর ডানের এলিমেন্টগুলো একদম ডান কোনায় পুশ হবে */}
          <ul className="navbar-nav ms-lg-5 me-lg-auto text-center mb-3 mb-lg-0 fw-medium">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/positions">Positions</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
          </ul>

          {/* User Conditional Buttons */}
          {!user ? (
            /* ms-lg-auto বড় স্ক্রিনে এটিকে ডানে রাখবে এবং ছোট স্ক্রিনে সেন্টারে নিয়ে আসবে */
            <div className="d-flex flex-column flex-lg-row gap-2 mb-3 mb-lg-0 justify-content-center ms-lg-auto">
              <Link to="/login" className="btn btn-outline-primary px-4">Login</Link>
              <Link to="/register" className="btn btn-primary px-4">Register</Link>
            </div>
          ) : (
            /* এখানেও ms-lg-auto ব্যবহারের মাধ্যমে ড্রপডাউনটিকে বড় স্ক্রিনে একদম ডানে রেসপনসিভ এলাইন করা হয়েছে */
            <div className="dropdown d-flex justify-content-center justify-content-lg-end mb-3 mb-lg-0 ms-lg-auto">
              <button
                type="button"
                className="btn p-0 border-0 bg-transparent dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.photo ? (
                  <img src={user.photo} alt="Profile" className="rounded-circle" width="42" height="42" />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ width: "42px", height: "42px", fontWeight: "bold", fontSize: "16px" }}
                  >
                    {user.firstName?.charAt(0) || "U"} 
                  </div>
                )}
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ minWidth: "260px" }}>
                <li className="px-3 py-3">
                  <h6 className="mb-1">{user.firstName} {user.lastName}</h6>
                  <small className="text-muted">{user.email}</small>
                  <div className="mt-2"><span className="badge bg-primary">{user.role}</span></div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link to="/dashboard" className="dropdown-item">Dashboard</Link></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
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