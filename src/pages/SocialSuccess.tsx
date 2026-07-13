import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // আপনার সঠিক পাথ দিন
import Loading from '../components/Loader/loading';

export const SocialSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // 🔒 ইনফিনিট লুপ ঠেকানোর জন্য একটি স্ট্রং গার্ড (Ref)
  const isProcessed = useRef(false);

  useEffect(() => {
    // যদি অলরেডি একবার এই লজিক চলে থাকে, তবে দ্বিতীয়বার আর ঢুকবে না
    if (isProcessed.current) return;

    const token = searchParams.get('token');
    const userStr = searchParams.get('user'); 

    if (token) {
      isProcessed.current = true; // প্রথমবারেই লক করে দেওয়া হলো
      
      try {
        const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
        
        // ১. গ্লোবাল স্টেটে লগইন করান
        login(token, user);
        
        // ২. সরাসরি ড্যাশবোর্ড প্রোফাইলে নিয়ে যান
        navigate("/dashboard/profile", { replace: true });
      } catch (error) {
        console.error("OAuth Data Parsing Error:", error);
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, login, navigate]);

  // পেজ রিডাইরেক্ট হওয়ার আগ পর্যন্ত এই সুন্দর মেসেজটি দেখাবে
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="spinner-border text-primary mb-3" role="status">
       <Loading/>
      </div>
      <h5 className="text-muted fw-semibold">Authenticating with Google...</h5>
    </div>
  );
};