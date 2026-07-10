import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { 
  FaUser, FaBriefcase, FaFileAlt, FaList, FaComments, 
  FaDatabase, FaPlusCircle, FaUsers, FaChartPie, FaCog, FaHome 
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useAxiosSecure from "../hooks/useAxiossecure";
import Loading from "../components/Loader/loading";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ১. ডাটাবেজ থেকে ইউজারের রোল এবং ডিটেইলস ফেচ করা
  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await useAxiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const role = dbUser?.role; // candidate, recruiter, admin

  // ২. রিডাইরেক্ট লজিক (রোল অনুযায়ী হোম পেজে পাঠানো)
  useEffect(() => {
    if (loading || isLoading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (location.pathname === "/dashboard") {
      if (role === "candidate") navigate("/dashboard/candidate/profile", { replace: true });
      else if (role === "recruiter") navigate("/dashboard/recruiter/positions", { replace: true });
      else if (role === "admin") navigate("/dashboard/admin/statistics", { replace: true });
    }
  }, [user, loading, isLoading, role, location.pathname, navigate]);

  if (loading || isLoading) return <Loading />;
  if (!user) return null;

  // ৩. মেনু আইটেম সেটআপ (প্রোজেক্ট রিকোয়ারমেন্ট অনুযায়ী)

  // ক্যান্ডিডেট মেনু
  const candidateMenu = [
    { label: "Profile (Me)", path: "/dashboard/candidate/profile", icon: <FaUser /> },
    { label: "My Attributes", path: "/dashboard/candidate/attributes", icon: <FaList /> },
    { label: "Projects", path: "/dashboard/candidate/projects", icon: <FaBriefcase /> },
    { label: "My CVs", path: "/dashboard/candidate/my-cvs", icon: <FaFileAlt /> },
    { label: "Available Positions", path: "/dashboard/candidate/available-positions", icon: <FaList /> },
    { label: "Discussions", path: "/dashboard/candidate/discussions", icon: <FaComments /> },
  ];

  // রিক্রুটার মেনু
  const recruiterMenu = [
    { label: "Positions", path: "/dashboard/recruiter/positions", icon: <FaBriefcase /> },
    { label: "Create Position", path: "/dashboard/recruiter/create-position", icon: <FaPlusCircle /> },
    { label: "Attribute Library", path: "/dashboard/recruiter/attribute-library", icon: <FaDatabase /> },
    { label: "Candidate CVs", path: "/dashboard/recruiter/candidate-cvs", icon: <FaFileAlt /> },
    { label: "Discussions", path: "/dashboard/recruiter/discussions", icon: <FaComments /> },
  ];

  // এডমিন মেনু
  const adminMenu = [
    { label: "Statistics", path: "/dashboard/admin/statistics", icon: <FaChartPie /> },
    { label: "Manage Users", path: "/dashboard/admin/users", icon: <FaUsers /> },
    { label: "All CVs", path: "/dashboard/admin/all-cvs", icon: <FaFileAlt /> },
    { label: "System Settings", path: "/dashboard/admin/settings", icon: <FaCog /> },
  ];

  // রোল অনুযায়ী মেনু ফিল্টার করা
  let menuItems = [];
  if (role === "candidate") menuItems = candidateMenu;
  else if (role === "recruiter") menuItems = recruiterMenu;
  else if (role === "admin") menuItems = adminMenu;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* সাইডবার */}
        <aside 
          className={`${
            sidebarOpen ? "w-72" : "w-20"
          } bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shadow-xl z-20`}
        >
          {/* সাইডবার টগল বাটন */}
          <div className="p-4 flex justify-between items-center border-b border-slate-800">
            {sidebarOpen && <span className="font-bold text-white tracking-wider">DynoCV Dashboard</span>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors ml-auto"
            >
              {sidebarOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
            </button>
          </div>

          {/* মেনু লিস্ট */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group ${
                  location.pathname === item.path 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className={`text-xl ${location.pathname === item.path ? "text-white" : "group-hover:text-blue-400"}`}>
                  {item.icon}
                </span>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* ইউজার ইনফো (নিচে) */}
          {sidebarOpen && (
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.displayName?.charAt(0) || role?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{user?.displayName || "User"}</p>
                  <p className="text-xs text-slate-500 capitalize">{role}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* ব্রেডক্রাম্ব বা হেডার এখানে যোগ করতে পারেন */}
            <div className="mb-6">
               <h1 className="text-2xl font-bold text-slate-800 capitalize">
                 {location.pathname.split("/").pop()?.replace("-", " ")}
               </h1>
            </div>
            
            {/* সাব-পেজগুলো এখানে রেন্ডার হবে */}
            <div className="bg-white rounded-xl shadow-sm min-h-[calc(100vh-200px)] p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;