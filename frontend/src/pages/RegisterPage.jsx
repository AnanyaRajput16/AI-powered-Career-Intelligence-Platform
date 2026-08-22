import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setUiError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUiError('');
    setSuccess('');

    const { name, email, password, confirmPassword } = formData;

    // Check all fields
    if (!name || !email || !password || !confirmPassword) {
      setUiError('Please fill in all fields.');
      return;
    }

    // Name length check
    if (name.trim().length < 2) {
      setUiError('Please enter your full name (at least 2 characters).');
      return;
    }

    // Email structure validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setUiError('Please enter a valid email address.');
      return;
    }

    // Password strength check
    if (password.length < 6) {
      setUiError('Password must be at least 6 characters long.');
      return;
    }

    // Password confirmation matching
    if (password !== confirmPassword) {
      setUiError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login...');
      // Clear forms
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
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
            <h2>Create Account</h2>
            <p>Start your AI-powered career roadmap today</p>
          </div>

          {uiError && (
            <div className="alert alert-error" id="register-error-alert">
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span>{uiError}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" id="register-success-alert">
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} noValidate id="register-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name-input">Full Name</label>
              <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <input
                  type="text"
                  id="name-input"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  placeholder="•••••••• (Min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password-input">Confirm Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <input
                  type="password"
                  id="confirm-password-input"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              style={{ marginTop: '1rem' }}
              disabled={isSubmitting}
              id="register-submit-btn"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account? </span>
            <Link to="/login" className="auth-footer-link" id="goto-login-link">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default RegisterPage;
