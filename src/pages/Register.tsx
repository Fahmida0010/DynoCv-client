import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema, type RegisterInput } from '../schemas/auth.schema';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CANDIDATE'
    }
  });

  const handleRegister = async (data: RegisterInput) => {
    try {
      setError(null);
      const response = await API.post('/auth/register', data);
      auth?.login(response.data.access_token, response.data.user);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${provider}`;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow-sm" style={{ width: '450px', borderRadius: '10px' }}>
        <h3 className="mb-4 text-center fw-bold text-primary">Create Account</h3>
        
        {error && <div className="alert alert-danger p-2 small">{error}</div>}

        <form onSubmit={handleSubmit(handleRegister)}>
          {/* Role Selection Option */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Join As</label>
            <select
              {...register('role')}
              className={`form-select ${errors.role ? 'is-invalid' : ''}`}
            >
              <option value="CANDIDATE">Candidate (Looking for Job)</option>
              <option value="RECRUITER">Recruiter (Hiring Talent)</option>
            </select>
            {errors.role && <div className="invalid-feedback small">{errors.role.message}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-semibold">First Name</label>
              <input 
                type="text" 
                {...register('firstName')} 
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} 
                placeholder="John"
              />
              {errors.firstName && <div className="invalid-feedback small">{errors.firstName.message}</div>}
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-semibold">Last Name</label>
              <input 
                type="text" 
                {...register('lastName')} 
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} 
                placeholder="Doe"
              />
              {errors.lastName && <div className="invalid-feedback small">{errors.lastName.message}</div>}
            </div>
          </div>

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

          {/* Password Group With Hide/Show Feature */}
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <div className="input-group">
              <input 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')} 
                className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                placeholder="••••••••"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ borderTopRightRadius: '0.375rem', borderBottomRightRadius: '0.375rem' }}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
              {errors.password && <div className="invalid-feedback small d-block">{errors.password.message}</div>}
            </div>
          </div>

          {/* Dynamic Action Button Label Based on Runtime Role Input */}
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100 fw-bold mb-3">
            {isSubmitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="position-relative my-4 text-center">
          <hr />
          <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">Or Register with</span>
        </div>

        {/* Social Login Buttons with Icons Embedded */}
        <div className="d-grid gap-2">
          <button 
            type="button" 
            onClick={() => handleSocialLogin('google')} 
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center fw-semibold small"
          >
            <i className="bi bi-google me-2"></i> Continue with Google
          </button>
          <button 
            type="button" 
            onClick={() => handleSocialLogin('facebook')} 
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center fw-semibold small"
          >
            <i className="bi bi-facebook me-2"></i> Continue with Facebook
          </button>
        </div>

        <p className="text-center small text-muted mt-4 mb-0">
          Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};