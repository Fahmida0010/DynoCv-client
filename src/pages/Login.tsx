import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { loginSchema, type LoginInput } from '../schemas/auth.schema';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';



export const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginInput) => {
    try {
      setError(null);
      const response = await API.post('/auth/login', data);
      auth?.login(response.data.access_token, response.data.user);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${provider}`;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow-sm" style={{ width: '400px', borderRadius: '10px' }}>
        <h3 className="mb-4 text-center fw-bold text-primary">Sign In</h3>
        
        {error && <div className="alert alert-danger p-2 small">{error}</div>}

        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <input 
              type="email" 
              {...register('email')} 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
              placeholder="name@example.com"
            />
            {errors.email && <div className="invalid-feedback small">{errors.email.message}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input 
              type="password" 
              {...register('password')} 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
              placeholder="••••••••"
            />
            {errors.password && <div className="invalid-feedback small">{errors.password.message}</div>}
          </div>

          {/* Login Submit Button */}
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100 fw-bold mb-3">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="position-relative my-4 text-center">
          <hr />
          <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">Or Sign In with</span>
        </div>

        {/* Social Buttons */}
        <div className="d-grid gap-2">
          <button 
            type="button" 
            onClick={() => handleSocialLogin('google')} 
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center fw-semibold small"
          >
            <i className="bi bi-google me-2"></i> Google
          </button>
          <button 
            type="button" 
            onClick={() => handleSocialLogin('facebook')} 
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center fw-semibold small"
          >
            <i className="bi bi-facebook me-2"></i> Facebook
          </button>
        </div>

        <p className="text-center small text-muted mt-4 mb-0">
          Don't have an account? <Link to="/register" className="text-decoration-none fw-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
};