import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (selector) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      // Timeout to allow navigation to complete before scrolling
      setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(selector);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-header" id="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link" id="nav-logo">
          <svg className="logo-icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096m.813 5.096a3.5 3.5 0 110-7m0 7a3.5 3.5 0 100-7m-7.464 1.34L3 16.5m0 0l.813-5.096m-.813 5.096a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm16.294-4.22L17.5 13m0 0l-.813-5.096m.813 5.096a3.5 3.5 0 110-7 3.5 3.5 0 010 7zM9.813 15.904L13.5 13.5m0 0L17.5 13"></path>
          </svg>
          <span>Career<span className="gradient-text">AI</span></span>
        </Link>

        {/* Desktop & Mobile nav menu */}
        <nav>
          <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <button onClick={() => handleLinkClick('#features')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Features
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('#insights')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Insights
              </button>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                {/* Mobile Logout Link */}
                <li className="nav-actions-mobile" style={{ display: 'none' }}>
                  <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }} id="mobile-logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-actions-mobile" style={{ display: 'none' }}>
                  <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary" id="nav-dashboard-btn">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-primary" id="nav-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" id="nav-login-btn">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" id="nav-register-btn">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Navigation Menu" id="nav-toggle-btn">
          {isOpen ? (
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
