import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { 
  FaUser, FaBriefcase, FaFileAlt, FaList, FaComments, 
  FaDatabase, FaPlusCircle, FaUsers, FaChartPie, FaCog 
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Loading from "../components/Loader/loading";
import useAxiosSecure from "../hooks/useAxiossecure";

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface DBUser {
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  email: string;
  firstName?: string; 
  lastName?: string; 
  photo?: string;     
  [key: string]: any;
}

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  // ডাটাবেজ থেকে ইউজারের রোল এবং ডিটেইলস ফেচ করা
  const { data: dbUser, isLoading } = useQuery<DBUser>({
    queryKey: ["dbUser", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/auth/users/${user?.email}`);
      console.log("API Response:", res.data);
      return res.data;
    },
  });

  console.log("dbUser =", dbUser);

  const role = dbUser?.role;
  
  const firstName = dbUser?.firstName || dbUser?.firstName || user?.firstName || user?.email?.split('@')[0] || "User";

  // রিডাইরেক্ট প্রোটেকশন
  useEffect(() => {
    if (loading || isLoading) return;
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, isLoading, navigate]);

  if (loading || isLoading) return <Loading />;
  if (!user) return null;

  // মেনু আইটেম সেটআপ
  const candidateMenu: MenuItem[] = [
    
    { label: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
    { label: "My Attributes", path: "/dashboard/attributes", icon: <FaList /> },
    { label: "Projects", path: "/dashboard/projects", icon: <FaBriefcase /> },
    { label: "My CVs", path: "/dashboard/my-cvs", icon: <FaFileAlt /> },
    { label: "Available Positions", path: "/dashboard/available-positions", icon: <FaList /> },
    { label: "Discussions", path: "/dashboard/discussions", icon: <FaComments /> },
  ];

  const recruiterMenu: MenuItem[] = [
    { label: "My Profile", path: "/dashboard/profile", icon: <FaUser /> },
    { label: "Positions", path: "/dashboard/positions", icon: <FaBriefcase /> },
    { label: "Create Position", path: "/dashboard/create-position", icon: <FaPlusCircle /> },
    { label: "Attribute Library", path: "/dashboard/attribute-library", icon: <FaDatabase /> },
    { label: "Candidate CVs", path: "/dashboard/candidate-cvs", icon: <FaFileAlt /> },
    { label: "Discussions", path: "/dashboard/discussions", icon: <FaComments /> },
  ];

  const adminMenu: MenuItem[] = [
    { label: "My Profile ", path: "/dashboard/profile", icon: <FaUser /> },
    { label: "Statistics", path: "/dashboard/statistics", icon: <FaChartPie /> },
    { label: "Manage Users", path: "/dashboard/users", icon: <FaUsers /> },
    { label: "All CVs", path: "/dashboard/all-cvs", icon: <FaFileAlt /> },
    { label: "System Settings", path: "/dashboard/settings", icon: <FaCog /> },
  ];

  let menuItems: MenuItem[] = [];
  if (role === "CANDIDATE") menuItems = candidateMenu;
  else if (role === "RECRUITER") menuItems = recruiterMenu;
  else if (role === "ADMIN") menuItems = adminMenu;

 console.log("Role:", role);
console.log("Menu:", menuItems);

  return (

     
    <div className="d-flex flex-column min-vh-screen bg-light">
      <Navbar />

      {/* মোবাইল ডিভাইসের জন্য ফ্লোটিং টগল বাটন */}
      <div className="d-md-none p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
        <h5 className="m-0 fw-bold text-dark text-capitalize">
          {location.pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
        </h5>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="btn btn-outline-dark p-2"
        >
          {sidebarOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
        </button>
      </div>

      <div className="d-flex flex-grow-1 position-relative">
        
        {/* সাইডবার (aside) */}
        <aside 
          className={`bg-white text-dark d-flex flex-column shadow ${
            sidebarOpen ? "d-flex" : "d-none d-md-flex"
          }`}
          style={{
            width: sidebarOpen ? "280px" : "80px",
            transition: "width 0.3s ease",
            minHeight: "calc(100vh - 56px)",
            zIndex: 1040
          }}
        >
          {/* সাইডবার হেডার (ডেস্কটপ মোডে টগল বাটন) */}
          <div className="p-3 d-none d-md-flex justify-content-between align-items-center border-bottom border-light">
            {sidebarOpen && <span className="fw-bold text-primary  tracking-wider">Dashboard</span>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="btn btn-link text-dark p-1 ms-auto text-decoration-none"
            >
              {sidebarOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
            </button>
          </div>

          {/* নেভিগেশন মেনু */}
          <nav className="flex-grow-1 overflow-auto py-3 px-2">
            <ul className="nav nav-pills flex-column gap-2 list-unstyled">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => {
                        if(window.innerWidth < 768) setSidebarOpen(false);
                      }}
                      className={`nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded text-decoration-none transition-all ${
                        isActive ? "active bg-primary text-white shadow-lg" : "text-secondary hover-bg-custom"
                      }`}
                    >
                      <span className={`fs-5 d-flex align-items-center ${isActive ? "text-white" : "text-secondary"}`}>
                        {item.icon}
                      </span>
                      {sidebarOpen && <span className={`fw-medium ${isActive ? "text-white" : "text-dark"}`}>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ইউজার প্রোফাইল ফুটনোট */}
          {sidebarOpen && (
            <div className="p-3 border-top border-light bg-light mt-auto">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold fs-5"
                  style={{ width: "45px", height: "45px", minWidth: "45px" }}
                >
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  {/* ফিক্সড ডাইনামিক নেম */}
                  <p className="m-0 text-sm fw-bold text-dark text-truncate">{firstName}</p>
                  <p className="m-0 text-xs text-muted text-capitalize">{role}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-grow-1 p-3 p-md-5 bg-light overflow-auto">
          <div className="container-fluid">
            
            {/* পেজ টাইটেল হেডার */}
            <div className="d-none d-md-block mb-4">
               <h2 className="fw-bold text-dark text-capitalize m-0">
                 {location.pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
               </h2>
            </div>
            
            {/* চাইল্ড কম্পোনেন্ট রেন্ডারিং এরিয়া */}
            <div className="bg-white rounded shadow-sm p-4" style={{ minHeight: "calc(100vh - 240px)" }}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* কাস্টম সিএসএস হোভার স্টাইল */}
      <style>{`
        .hover-bg-custom:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
          color: #000000 !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;