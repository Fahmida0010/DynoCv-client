import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";



const axiosSecure = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,

});

export const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();


  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("dynocv_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: 401 বা 403 এরর আসলে অটো লগআউট
  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;