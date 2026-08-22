import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ResumeAnalyzer from '../components/ResumeAnalyzer';
import UserProfile from '../components/UserProfile';
import ResumeParser from '../components/ResumeParser';
import AtsAnalyzer from '../components/AtsAnalyzer';
import SkillGapAnalyzer from '../components/SkillGapAnalyzer';
import CareerRecommendations from '../components/CareerRecommendations';
import JobRecommendations from '../components/JobRecommendations';
import CourseRecommendations from '../components/CourseRecommendations';
import ResumeImprovements from '../components/ResumeImprovements';
import DashboardAnalytics from '../components/DashboardAnalytics';
import LearningPath from '../components/LearningPath';
import CareerPrediction from '../components/CareerPrediction';
import FeedbackForm from '../components/FeedbackForm';
import Internships from '../components/Internships';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeHash = location.hash;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      axios.get('/api/notifications')
        .then(res => setNotifications(res.data))
        .catch(err => console.error('Error fetching notifications:', err));
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Quick Action Click Responders
  const handleQuickAction = (action) => {
    if (action === 'Scan Resume') {
      navigate('#resume-analyzer');
    } else {
      alert(`Quick Action Triggered: ${action}\nThis feature simulation is active for Milestone 1 evaluation.`);
    }
  };

  // Guard routing - redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <svg style={{ width: '3rem', height: '3rem', animation: 'spin 1s linear infinite', stroke: 'var(--accent-blue)' }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span style={{ color: 'var(--text-secondary)' }}>Loading Career Intel...</span>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Double check user availability before render
  if (!user) return null;

  // Profile Completion Calculation
  const calculateProfileCompletion = (u) => {
    if (!u) return { percent: 0, completed: [], missing: [] };

    const criteria = [
      { name: 'Personal Information', check: () => u.name && u.email },
      { name: 'Education', check: () => u.college || (u.aboutMe && u.aboutMe.includes('Education')) },
      { name: 'Skills', check: () => u.skills && u.skills.length > 0 },
      { name: 'Projects', check: () => u.projects && u.projects.length > 0 },
      { name: 'Work Experience', check: () => u.workExperience && u.workExperience.length > 0 },
      { name: 'Certifications', check: () => u.certifications && u.certifications.length > 0 },
      { name: 'Resume Uploaded', check: () => u.resume && u.resume.fileName }
    ];

    const completed = [];
    const missing = [];

    criteria.forEach(c => {
      if (c.check()) {
        completed.push(c.name);
      } else {
        missing.push(c.name);
      }
    });

    const percent = Math.round((completed.length / criteria.length) * 100);
    return { percent, completed, missing };
  };

  const { percent: completionPercent, completed: completedFields, missing: missingFields } = calculateProfileCompletion(user);

  return (
    <div className="dashboard-wrapper">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        {/* Dashboard Header Bar */}
        <header className="dashboard-header">
          <div>
            <button
              className="db-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar Menu"
              id="sidebar-toggle-btn"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h1 id="dashboard-main-title">Career Cockpit</h1>
          </div>
          <div className="dashboard-date" id="dashboard-current-date" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', position: 'relative', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '0', right: '0', background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '99px' }}>{unreadCount}</span>
                )}
              </button>
              
              {showNotifications && (
                <div className="glass-card" style={{ position: 'absolute', top: '100%', right: '0', width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 100, padding: '1rem', marginTop: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0 }}>Notifications</h4>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllAsRead} style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: '0.8rem' }}>Mark all read</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No notifications</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {notifications.map(n => (
                        <div key={n._id} onClick={() => !n.isRead && handleMarkAsRead(n._id)} style={{ padding: '0.75rem', borderRadius: '8px', background: n.isRead ? 'transparent' : 'rgba(255,255,255,0.05)', border: n.isRead ? 'none' : '1px solid rgba(255,255,255,0.1)', cursor: n.isRead ? 'default' : 'pointer' }}>
                          <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.message}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {activeHash === '#resume-analyzer' ? (
          <ResumeAnalyzer />
        ) : activeHash === '#resume-parsing' ? (
          <ResumeParser />
        ) : activeHash === '#ats-analysis' ? (
          <AtsAnalyzer />
        ) : activeHash === '#skill-gap' ? (
          <SkillGapAnalyzer />
        ) : activeHash === '#career-recommendations' ? (
          <CareerRecommendations />
        ) : activeHash === '#job-recommendations' ? (
          <JobRecommendations />
        ) : activeHash === '#course-recommendations' ? (
          <CourseRecommendations />
        ) : activeHash === '#resume-improvements' ? (
          <ResumeImprovements />
        ) : activeHash === '#profile' ? (
          <UserProfile />
        ) : activeHash === '#analytics' ? (
          <DashboardAnalytics />
        ) : activeHash === '#learning-path' ? (
          <LearningPath />
        ) : activeHash === '#internships' ? (
          <Internships />
        ) : activeHash === '#predictions' ? (
          <CareerPrediction />
        ) : activeHash === '#feedback' ? (
          <FeedbackForm />
        ) : (
          <DashboardAnalytics />
        )}

      </main>
    </div>
  );
};

export default Dashboard;
