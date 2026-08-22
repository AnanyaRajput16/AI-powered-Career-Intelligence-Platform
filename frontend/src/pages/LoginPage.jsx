import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [uiError, setUiError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setUiError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUiError('');
    setSuccess('');

    const { email, password } = formData;

    // Standard client side validations
    if (!email || !password) {
      setUiError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setUiError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setUiError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setUiError(result.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Login to access your AI Career Intelligence</p>
          </div>

          {uiError && (
            <div className="alert alert-error" id="login-error-alert">
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span>{uiError}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" id="login-success-alert">
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} noValidate id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                <input
                  type="email"
                  id="email-input"
                  name="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <input
                  type="password"
                  id="password-input"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="remember-checkbox" htmlFor="remember-checkbox-input">
                <input
                  type="checkbox"
                  id="remember-checkbox-input"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember Me</span>
              </label>
              <a
                href="#forgot"
                className="forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password recovery is not implemented in Milestone 1. Please register a new user.');
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
              id="login-submit-btn"
            >
              {isSubmitting ? 'Verifying Account...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <span>Don't have an account? </span>
            <Link to="/register" className="auth-footer-link" id="goto-register-link">
              Register here
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
