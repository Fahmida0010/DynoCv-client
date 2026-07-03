import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
  schema: any;
  apiError: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, schema, apiError }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-sm">
      <h3 className="mb-4 text-center text-capitalize">{type}</h3>
      
      {apiError && <div className="alert alert-danger">{apiError}</div>}

      {type === 'register' && (
        <>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName.message as string}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName.message as string}</div>}
          </div>
        </>
      )}

      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input type="email" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
        {errors.email && <div className="invalid-feedback">{errors.email.message as string}</div>}
      </div>

      <div className="mb-4">
        <label className="form-label">Password</label>
        <input type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
        {errors.password && <div className="invalid-feedback">{errors.password.message as string}</div>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100">
        {isSubmitting ? 'Processing...' : type === 'login' ? 'Sign In' : 'Register'}
      </button>
    </form>
  );
};