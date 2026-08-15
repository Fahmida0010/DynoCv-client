import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Loading from '../components/Loader/loading';

export const SocialSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();


  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;

    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token) {
      isProcessed.current = true;

      try {
        const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;


        login(token, user);


        navigate("/dashboard/profile", { replace: true });
      } catch (error) {
        console.error("OAuth Data Parsing Error:", error);
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="spinner-border text-primary mb-3" role="status">
        <Loading />
      </div>
      <h5 className="text-muted fw-semibold">Authenticating with Google...</h5>
    </div>
  );
};