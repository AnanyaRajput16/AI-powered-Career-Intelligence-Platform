import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const features = [
    {
      title: 'Career Insights',
      description: 'Gain data-driven knowledge about industry trends, high-demand positions, and emerging roles in tech and business.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="var(--accent-blue)" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      ),
      color: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'AI Resume Analysis',
      description: 'Upload your resume and let our neural networks scan and grade it against industry benchmarks to optimize your landing rates.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      color: 'rgba(6, 182, 212, 0.1)'
    },
    {
      title: 'Skill Gap Analysis',
      description: 'Compare your skills directly with employer requirements. Pinpoint exact knowledge barriers blocking your next promotion.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="var(--accent-indigo)" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
        </svg>
      ),
      color: 'rgba(99, 102, 241, 0.1)'
    },
    {
      title: 'Learning Recommendations',
      description: 'Receive custom, curated learning roadmaps featuring elite courses to plug your personal skill deficits efficiently.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="var(--accent-emerald)" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      ),
      color: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Career Prediction',
      description: 'Leverage deep predictive modeling to project likely career trajectories, transitions, and long-term viability trends.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="var(--accent-rose)" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      color: 'rgba(244, 63, 94, 0.1)'
    },
    {
      title: 'Salary Prediction',
      description: 'Forecast potential compensation growth patterns across various career paths based on historical and real-time market data.',
      icon: (
        <svg className="feature-icon" fill="none" stroke="var(--accent-amber)" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-wrapper" id="home">
        <div className="hero-glow-bg"></div>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="badge">
                <span className="badge-dot"></span>
                <span>Next-Gen AI Career Guide</span>
              </div>
              <h1 className="page-title">
                Navigate Your Career with <br />
                <span className="gradient-text">Artificial Intelligence</span>
              </h1>
              <p className="hero-description">
                Unlock insights, identify hidden skill gaps, structure personalized learning routines, and accurately project your earning capacity.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary" id="hero-cta-btn">
                  Get Started Free
                </Link>
                <a href="#features" className="btn btn-secondary" id="hero-secondary-btn">
                  Explore Features
                </a>
              </div>
            </div>
            
            <div className="hero-art-container float-animation">
              {/* Premium Vector SVG Illustration representing Career AI and Data Graphs */}
              <svg className="hero-svg" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Ring */}
                <circle cx="250" cy="250" r="180" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="4" strokeDasharray="10 15" />
                <circle cx="250" cy="250" r="220" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="2" />
                
                {/* Core Sphere */}
                <defs>
                  <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="50%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </radialGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <circle cx="250" cy="250" r="80" fill="url(#sphereGrad)" filter="drop-shadow(0 0 30px rgba(99, 102, 241, 0.4))" />
                
                {/* Connecting Node Net */}
                <line x1="250" y1="250" x2="120" y2="180" stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="4 4" />
                <line x1="250" y1="250" x2="380" y2="180" stroke="url(#lineGrad)" strokeWidth="3" />
                <line x1="250" y1="250" x2="330" y2="340" stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="2 2" />
                <line x1="250" y1="250" x2="150" y2="340" stroke="url(#lineGrad)" strokeWidth="3" />
                
                {/* Surrounding Node Data Cards */}
                {/* Card 1: Resume Analysis */}
                <g filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))">
                  <rect x="70" y="140" width="100" height="50" rx="10" fill="#1e293b" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <text x="120" y="165" fill="#f3f4f6" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CV Analyzer</text>
                  <text x="120" y="180" fill="#10b981" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Score: 92%</text>
                </g>
                
                {/* Card 2: Skill Gaps */}
                <g filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))">
                  <rect x="330" y="140" width="100" height="50" rx="10" fill="#1e293b" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <text x="380" y="165" fill="#f3f4f6" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Skills Map</text>
                  <circle cx="355" cy="180" r="4" fill="#6366f1" />
                  <circle cx="367" cy="180" r="4" fill="#6366f1" />
                  <circle cx="379" cy="180" r="4" fill="#6366f1" />
                  <circle cx="391" cy="180" r="4" fill="rgba(255,255,255,0.2)" />
                </g>

                {/* Card 3: Salary Prediction */}
                <g filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))">
                  <rect x="280" y="310" width="110" height="50" rx="10" fill="#1e293b" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <text x="335" y="335" fill="#f3f4f6" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Salary Index</text>
                  <text x="335" y="350" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">$145k / yr</text>
                </g>

                {/* Card 4: Learning Path */}
                <g filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))">
                  <rect x="100" y="310" width="100" height="50" rx="10" fill="#1e293b" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <text x="150" y="335" fill="#f3f4f6" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Learn Path</text>
                  <rect x="120" y="344" width="60" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
                  <rect x="120" y="344" width="45" height="4" rx="2" fill="#06b6d4" />
                </g>
                
                {/* Floating Elements */}
                <circle cx="160" cy="90" r="6" fill="#06b6d4" filter="drop-shadow(0 0 10px #06b6d4)" />
                <polygon points="360,95 365,105 355,105" fill="#f43f5e" filter="drop-shadow(0 0 8px #f43f5e)" />
                <rect x="230" y="110" width="12" height="12" rx="3" fill="#10b981" transform="rotate(45 230 110)" filter="drop-shadow(0 0 10px #10b981)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <h2 className="section-title">
            Empowered by Core <span className="gradient-text">Intelligence Engines</span>
          </h2>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="glass-card feature-card" key={index}>
                <div className="feature-icon-wrapper" style={{ backgroundColor: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insights Showcase Section */}
      <section className="features-section" id="insights" style={{ background: 'rgba(17, 24, 39, 0.3)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="hero-grid" style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
            <div className="hero-art-container">
              {/* Graph Graphic */}
              <svg className="hero-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="30" width="340" height="340" rx="20" fill="#111827" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
                {/* Grid Lines */}
                <line x1="60" y1="80" x2="340" y2="80" stroke="rgba(255,255,255,0.03)" />
                <line x1="60" y1="150" x2="340" y2="150" stroke="rgba(255,255,255,0.03)" />
                <line x1="60" y1="220" x2="340" y2="220" stroke="rgba(255,255,255,0.03)" />
                <line x1="60" y1="290" x2="340" y2="290" stroke="rgba(255,255,255,0.03)" />
                
                {/* Trend line */}
                <path d="M 60 290 Q 130 200 200 150 T 340 70" fill="none" stroke="url(#lineGrad)" strokeWidth="6" strokeLinecap="round" />
                <path d="M 60 290 Q 130 200 200 150 T 340 70" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 10px #6366f1)" />
                
                {/* Node Points */}
                <circle cx="60" cy="290" r="6" fill="#111827" stroke="#3b82f6" strokeWidth="4" />
                <circle cx="150" cy="205" r="6" fill="#111827" stroke="#3b82f6" strokeWidth="4" />
                <circle cx="240" cy="120" r="6" fill="#111827" stroke="#06b6d4" strokeWidth="4" />
                <circle cx="340" cy="70" r="6" fill="#111827" stroke="#10b981" strokeWidth="4" />
                
                {/* Pulse Glows */}
                <circle cx="340" cy="70" r="12" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3" opacity="0.8" />
              </svg>
            </div>
            
            <div className="hero-text">
              <div className="badge">
                <span>Insight Generation</span>
              </div>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '1.25rem' }}>
                Make Career Transitions <span className="gradient-text-cyan">100% Predictable</span>
              </h2>
              <p className="hero-description" style={{ fontSize: '1.05rem' }}>
                Stop guessing your future path. Our platform correlates employment statistics with real learning profiles to simulate transition risks, learning efforts, and expected ROI with unparalleled accuracy.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', stroke: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Dynamic resume tracking and scoring models.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', stroke: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Actionable skill gap closure paths.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', stroke: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Up-to-date industry growth prediction nodes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta-section">
        <div className="container">
          <div className="glass-card cta-card">
            <h2>Accelerate Your Career Intelligence</h2>
            <p>
              Join thousands of junior engineers and professionals planning their next move with absolute database confidence. Start analyzing for free today.
            </p>
            <Link to="/register" className="btn btn-primary" id="cta-register-btn">
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo-desc">
              <Link to="/" className="logo-link">
                <svg className="logo-icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096m.813 5.096a3.5 3.5 0 110-7m0 7a3.5 3.5 0 100-7m-7.464 1.34L3 16.5m0 0l.813-5.096m-.813 5.096a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm16.294-4.22L17.5 13m0 0l-.813-5.096m.813 5.096a3.5 3.5 0 110-7 3.5 3.5 0 010 7zM9.813 15.904L13.5 13.5m0 0L17.5 13"></path>
                </svg>
                <span>Career<span className="gradient-text">AI</span></span>
              </Link>
              <p className="footer-desc">
                AI-Powered Career Intelligence Platform. Model your paths, optimize your skills, and unlock market value.
              </p>
            </div>
            
            <div>
              <h4 className="footer-links-title">Features</h4>
              <ul className="footer-links-list">
                <li><a href="#features" className="footer-link">Resume Analyzer</a></li>
                <li><a href="#features" className="footer-link">Skill Gap Checker</a></li>
                <li><a href="#features" className="footer-link">Course Recommendation</a></li>
                <li><a href="#features" className="footer-link">Salary Trends</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="footer-links-title">Platform</h4>
              <ul className="footer-links-list">
                <li><Link to="/login" className="footer-link">Sign In</Link></li>
                <li><Link to="/register" className="footer-link">Sign Up</Link></li>
                <li><a href="#home" className="footer-link">Back to Top</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} CareerAI. All rights reserved.</span>
            <span>Infosys Internship Evaluation Project</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
