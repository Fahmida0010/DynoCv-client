import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiossecure";
import Loading from "../../../components/Loader/loading";

const DashboardHome = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  // ডাটাবেজ থেকে ইউজারের রোল ফেচ করা
  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/auth/users/${user.email}`);
      return res.data;
    },
  });

  const role = dbUser?.role; // candidate, recruiter, admin

  useEffect(() => {
    if (loading || isLoading) return;

    
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      if (role === "candidate") {
        navigate("/dashboard/profile", { replace: true });
      } else if (role === "recruiter") {
      
        navigate("/dashboard/profile", { replace: true });
      } else if (role === "admin") {
        navigate("/dashboard/profile", { replace: true });
      }
    }
  }, [user, loading, isLoading, role, location.pathname, navigate]);

  // লোডিং অবস্তায় স্পিনার দেখাবে
  if (loading || isLoading) return <Loading />;

  return null; // রিডাইরেক্ট হয়ে যাওয়ার কারণে এখানে কিছু রেন্ডার করার প্রয়োজন নেই
};

export default DashboardHome;