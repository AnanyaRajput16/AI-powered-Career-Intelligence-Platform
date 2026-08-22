import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalParsedResumes: 0
  });
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [activeTab, setActiveTab] = useState('Analytics');
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash === '#users') setActiveTab('Users');
    else if (hash === '#resumes') setActiveTab('Resumes');
    else if (hash === '#jobs') setActiveTab('Jobs');
    else if (hash === '#feedback') setActiveTab('Feedback');
    else if (hash === '#activity') setActiveTab('Activity Log');
    else if (hash === '#analytics' || hash === '#overview' || hash === '') setActiveTab('Analytics');
  }, [location.hash]);

  const handleTabClick = (tabName, hashValue) => {
    setActiveTab(tabName);
    window.location.hash = hashValue;
  };
  const [analytics, setAnalytics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  
  const [jobs, setJobs] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [searchJob, setSearchJob] = useState('');
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '', company: '', location: '', type: '', experience: '', requiredSkills: '', salary: ''
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (user?.role === 'admin') {
        try {
          const [statsRes, usersRes, jobsRes, feedbackRes, analyticsRes, activityRes, healthRes] = await Promise.all([
            axios.get('/api/admin/stats'),
            axios.get('/api/admin/users'),
            axios.get('/api/jobs'),
            axios.get('/api/feedback'),
            axios.get('/api/admin/analytics'),
            axios.get('/api/admin/activity'),
            axios.get('/api/health').catch(() => ({ data: { status: 'offline', timestamp: new Date() } }))
          ]);
          setStats(statsRes.data);
          setUsers(usersRes.data);
          setJobs(jobsRes.data);
          setFeedback(feedbackRes.data);
          setAnalytics(analyticsRes.data);
          setActivities(activityRes.data);
          setSystemHealth(healthRes.data);
          setError(null);
        } catch (err) {
          setError('Failed to load admin dashboard data.');
        } finally {
          setStatsLoading(false);
        }
      }
    };

    fetchAdminData();
  }, [user]);

  const refreshJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenJobModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        experience: job.experience,
        requiredSkills: (job.requiredSkills || []).join(', '),
        salary: job.salary,
        applyLink: job.applyLink || ''
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        title: '', company: '', location: '', type: '', experience: '', requiredSkills: '', salary: '', applyLink: ''
      });
    }
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...jobFormData,
        requiredSkills: jobFormData.requiredSkills.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingJob) {
        await axios.put(`/api/jobs/${editingJob._id}`, payload);
      } else {
        await axios.post('/api/jobs', payload);
      }
      setJobModalOpen(false);
      refreshJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving job');
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`/api/jobs/${id}`);
        refreshJobs();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting job');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Loading Admin...</span>
      </div>
    );
  }

  // Frontend protection
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="dashboard-wrapper">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
        <main className="dashboard-main">
          <header className="dashboard-header">
            <Navbar />
          </header>
          <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
            <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Access Denied</h2>
            <p style={{ color: 'var(--text-secondary)' }}>You do not have permission to view the Admin Dashboard.</p>
          </div>
        </main>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' ? true : (u.role || '').toLowerCase() === filterRole.toLowerCase();
    
    if (activeTab === 'Resumes' && !u.hasResume) return false;
    
    return matchesSearch && matchesRole;
  });

  const filteredJobs = jobs.filter((j) => {
    return j.title.toLowerCase().includes(searchJob.toLowerCase()) || 
           j.company.toLowerCase().includes(searchJob.toLowerCase()) ||
           j.location.toLowerCase().includes(searchJob.toLowerCase());
  });

  const downloadCSV = (filename, rows) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => {
          let val = row[header] || '';
          if (typeof val === 'string') {
            val = val.replace(/"/g, '""');
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
              val = `"${val}"`;
            }
          }
          return val;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    if (activeTab === 'Users') {
      const data = filteredUsers.map(u => ({
        Name: u.name,
        Email: u.email,
        Role: (u.role || 'user').toUpperCase(),
        'Registration Date': new Date(u.createdAt).toLocaleDateString(),
        Resume: u.hasResume ? 'Uploaded' : 'None'
      }));
      downloadCSV('users-report.csv', data);
    } else if (activeTab === 'Resumes') {
      const data = filteredUsers.map(u => ({
        Name: u.name,
        Email: u.email,
        'Resume Filename': u.fileName || 'Unknown',
        'Upload Date': u.uploadedAt ? new Date(u.uploadedAt).toLocaleDateString() : 'Unknown',
        'Parsed Status': u.isParsed ? 'Parsed' : 'Not Parsed'
      }));
      downloadCSV('resumes-report.csv', data);
    } else if (activeTab === 'Jobs') {
      const data = filteredJobs.map(j => ({
        Title: j.title,
        Company: j.company,
        Location: j.location,
        Type: j.type,
        Experience: j.experience,
        Salary: j.salary,
        'Required Skills': (j.requiredSkills || []).join('; ')
      }));
      downloadCSV('jobs-report.csv', data);
    } else if (activeTab === 'Feedback') {
      const data = feedback.map(f => ({
        'User Name': f.user?.name || 'Unknown',
        'User Email': f.user?.email || 'Unknown',
        Subject: f.subject,
        Message: f.message,
        Date: new Date(f.createdAt).toLocaleDateString()
      }));
      downloadCSV('feedback-report.csv', data);
    } else if (activeTab === 'Activity Log') {
      const data = activities.map(a => ({
        'User Name': a.user?.name || 'Unknown',
        'User Email': a.user?.email || 'Unknown',
        Activity: a.action,
        'Date/Time': new Date(a.timestamp).toLocaleString()
      }));
      downloadCSV('activity-report.csv', data);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <Navbar />
        </header>
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name} (Admin)</p>
          </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            <span>{error}</span>
          </div>
        )}

        {systemHealth && (
          <div className="glass-card" style={{ padding: '1rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>System Status</h3>
              {systemHealth.status === 'active' ? (
                <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', boxShadow: '0 0 8px var(--accent-emerald)' }}></span>
                  Online / Healthy
                </span>
              ) : (
                <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }}></span>
                  Offline
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Last Checked: {new Date(systemHealth.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        {statsLoading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading statistics...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Total Users</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                {stats.totalUsers}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Total Resumes Uploaded</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-emerald)' }}>
                {stats.totalResumes}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Total Parsed Resumes</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-indigo)' }}>
                {stats.totalParsedResumes}
              </div>
            </div>

          </div>
        )}

        {/* User & Resume Management Section */}
        {!statsLoading && (
          <div className="glass-card" style={{ padding: '2rem', marginTop: '3rem' }}>
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
              <h3 
                onClick={() => handleTabClick('Users', '#users')}
                style={{ fontSize: '1.5rem', paddingBottom: '0.75rem', cursor: 'pointer', borderBottom: activeTab === 'Users' ? '2px solid var(--accent-blue)' : 'none', color: activeTab === 'Users' ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                Users
              </h3>
              <h3 
                onClick={() => handleTabClick('Resumes', '#resumes')}
                style={{ fontSize: '1.5rem', paddingBottom: '0.75rem', cursor: 'pointer', borderBottom: activeTab === 'Resumes' ? '2px solid var(--accent-emerald)' : 'none', color: activeTab === 'Resumes' ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                Resumes
              </h3>
              <h3 
                onClick={() => handleTabClick('Jobs', '#jobs')}
                style={{ fontSize: '1.5rem', paddingBottom: '0.75rem', cursor: 'pointer', borderBottom: activeTab === 'Jobs' ? '2px solid var(--accent-indigo)' : 'none', color: activeTab === 'Jobs' ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                Jobs
              </h3>
              <h3 
                onClick={() => handleTabClick('Feedback', '#feedback')}
                style={{ fontSize: '1.5rem', paddingBottom: '0.75rem', cursor: 'pointer', borderBottom: activeTab === 'Feedback' ? '2px solid var(--accent-blue)' : 'none', color: activeTab === 'Feedback' ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                Feedback
              </h3>
              <h3 
                onClick={() => handleTabClick('Analytics', '#analytics')}
                style={{ fontSize: '1.5rem', paddingBottom: '0.75rem', cursor: 'pointer', borderBottom: activeTab === 'Analytics' ? '2px solid var(--accent-orange)' : 'none', color: activeTab === 'Analytics' ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                Analytics
              </h3>
              <h3 
                onClick={() => handleTabClick('Activity Log', '#activity')}
                style={{ fontSize: '1.5rem', paddingBottom: '0.75rem', cursor: 'pointer', borderBottom: activeTab === 'Activity Log' ? '2px solid var(--accent-indigo)' : 'none', color: activeTab === 'Activity Log' ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                Activity Log
              </h3>
            </div>
            
            {activeTab === 'Analytics' && analytics ? (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Platform Users</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{analytics.totalUsers}</div>
                  </div>
                  <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Resumes Uploaded</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{analytics.totalResumes}</div>
                  </div>
                  <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Parsed Resumes</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-emerald)' }}>{analytics.parsedResumeCount}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Top Platform Skills</h4>
                    {analytics.topSkills && analytics.topSkills.length > 0 ? (
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {analytics.topSkills.map((skill, idx) => (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                            <span style={{ textTransform: 'capitalize' }}>{skill.skill}</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>{skill.count} users</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ color: 'var(--text-muted)' }}>No skill data available.</div>
                    )}
                  </div>

                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Advanced Analytics</h4>
                    
                    {stats.averageATSScore !== null ? (
                      <div style={{ marginBottom: '1rem', padding: '1rem', borderLeft: '4px solid var(--accent-emerald)', background: 'rgba(16,185,129,0.1)' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--accent-emerald)' }}>Average ATS Score</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.averageATSScore}%</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Based on {stats.usersWithATSAnalysis} user analyses</div>
                      </div>
                    ) : (
                      <div style={{ marginBottom: '1rem', padding: '1rem', borderLeft: '4px solid #ef4444', background: 'rgba(239,68,68,0.1)' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Average ATS Score</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No ATS scans have been performed yet.</div>
                      </div>
                    )}
                    
                    <div style={{ marginBottom: '1rem', padding: '1rem', borderLeft: '4px solid #8b5cf6', background: 'rgba(139,92,246,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>Career Recommendations</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.careerRecommendationCount}</div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Total generations across all users</div>
                    </div>

                    <div style={{ marginBottom: '1rem', padding: '1rem', borderLeft: '4px solid #ec4899', background: 'rgba(236,72,153,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold', color: '#ec4899' }}>Job Recommendations</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.jobRecommendationCount}</div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Total generations across all users</div>
                    </div>
                    
                    <div style={{ padding: '1rem', borderLeft: '4px solid #14b8a6', background: 'rgba(20,184,166,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold', color: '#14b8a6' }}>Course Recommendations</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.courseRecommendationCount}</div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Total generations across all users</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'Users' || activeTab === 'Resumes' ? (
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="form-input" 
                  style={{ flex: 1, minWidth: '200px' }} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="form-input" 
                  style={{ width: '150px' }} 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="All" style={{ color: 'black' }}>All Roles</option>
                  <option value="User" style={{ color: 'black' }}>User</option>
                  <option value="Admin" style={{ color: 'black' }}>Admin</option>
                </select>
                <button className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }} onClick={handleExport}>
                  Export CSV
                </button>
              </div>
            ) : activeTab === 'Jobs' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Search by job title or company..." 
                  className="form-input" 
                  style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }} 
                  value={searchJob}
                  onChange={(e) => setSearchJob(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }} onClick={handleExport}>
                    Export CSV
                  </button>
                  <button className="btn btn-primary" onClick={() => handleOpenJobModal()}>
                    + Add Job
                  </button>
                </div>
              </div>
            ) : activeTab === 'Feedback' || activeTab === 'Activity Log' ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }} onClick={handleExport}>
                  Export CSV
                </button>
              </div>
            ) : null}

            {activeTab !== 'Analytics' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                    {activeTab === 'Users' && (
                      <>
                        <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Email</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Role</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Registration Date</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Resume</th>
                      </>
                    )}
                    {activeTab === 'Resumes' && (
                      <>
                        <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Email</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Resume Filename</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Upload Date</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Parsed Status</th>
                      </>
                    )}
                    {activeTab === 'Jobs' && (
                      <>
                        <th style={{ padding: '1rem 0.5rem' }}>Title</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Company</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Location</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Type</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Salary</th>
                        <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
                      </>
                    )}
                    {activeTab === 'Feedback' && (
                      <>
                        <th style={{ padding: '1rem 0.5rem' }}>User</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Subject</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Message</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                      </>
                    )}
                    {activeTab === 'Activity Log' && (
                      <>
                        <th style={{ padding: '1rem 0.5rem' }}>User</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Email</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Activity</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Date/Time</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'Users' || activeTab === 'Resumes') && (() => {
                    return filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '1rem 0.5rem' }}>{u.name}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>{u.email}</td>
                          
                          {activeTab === 'Users' && (
                            <>
                              <td style={{ padding: '1rem 0.5rem' }}>
                                <span style={{ 
                                  padding: '0.25rem 0.5rem', 
                                  borderRadius: '4px', 
                                  fontSize: '0.8rem',
                                  background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                  color: u.role === 'admin' ? '#ef4444' : 'var(--text-primary)'
                                }}>
                                  {(u.role || 'user').toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '1rem 0.5rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td style={{ padding: '1rem 0.5rem' }}>
                                {u.hasResume ? <span style={{ color: 'var(--accent-emerald)' }}>Uploaded</span> : <span style={{ color: 'var(--text-muted)' }}>None</span>}
                              </td>
                            </>
                          )}

                          {activeTab === 'Resumes' && (
                            <>
                              <td style={{ padding: '1rem 0.5rem' }}>
                                {u.fileName || <span style={{ color: 'var(--text-muted)' }}>Unknown</span>}
                              </td>
                              <td style={{ padding: '1rem 0.5rem' }}>
                                {u.uploadedAt ? new Date(u.uploadedAt).toLocaleDateString() : <span style={{ color: 'var(--text-muted)' }}>Unknown</span>}
                              </td>
                              <td style={{ padding: '1rem 0.5rem' }}>
                                {u.isParsed ? <span style={{ color: 'var(--accent-indigo)' }}>Parsed</span> : <span style={{ color: 'var(--text-muted)' }}>Not Parsed</span>}
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={activeTab === 'Users' ? '5' : '5'} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {activeTab === 'Resumes' ? 'No users with resumes found.' : 'No users found.'}
                        </td>
                      </tr>
                    );
                  })()}

                  {activeTab === 'Jobs' && (() => {
                    return filteredJobs.length > 0 ? (
                      filteredJobs.map((j) => (
                        <tr key={j._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '1rem 0.5rem' }}>{j.title}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>{j.company}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>{j.location}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>{j.type}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>{j.salary}</td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                            <button className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem', background: 'rgba(255,255,255,0.1)' }} onClick={() => handleOpenJobModal(j)}>Edit</button>
                            <button className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'rgba(239,68,68,0.2)', color: '#ef4444' }} onClick={() => handleDeleteJob(j._id)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No jobs found.
                        </td>
                      </tr>
                    );
                  })()}

                  {activeTab === 'Feedback' && (() => {
                    return feedback.length > 0 ? (
                      feedback.map((f) => (
                        <tr key={f._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div>{f.user?.name || 'Unknown'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.user?.email || 'Unknown'}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{f.subject}</td>
                          <td style={{ padding: '1rem 0.5rem', whiteSpace: 'pre-wrap', maxWidth: '400px' }}>{f.message}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No feedback found.
                        </td>
                      </tr>
                    );
                  })()}

                  {activeTab === 'Activity Log' && (() => {
                    return activities.length > 0 ? (
                      activities.map((a) => (
                        <tr key={a._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '1rem 0.5rem' }}>{a.user?.name || 'Unknown'}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>{a.user?.email || 'Unknown'}</td>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{a.action}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>{new Date(a.timestamp).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No activity found.
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* Job Modal */}
        {jobModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
              <form onSubmit={handleSaveJob} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Job Title</label>
                  <input required type="text" className="form-input" style={{ width: '100%' }} value={jobFormData.title} onChange={e => setJobFormData({...jobFormData, title: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Company</label>
                  <input required type="text" className="form-input" style={{ width: '100%' }} value={jobFormData.company} onChange={e => setJobFormData({...jobFormData, company: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Location</label>
                    <input required type="text" className="form-input" style={{ width: '100%' }} value={jobFormData.location} onChange={e => setJobFormData({...jobFormData, location: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Type</label>
                    <input required type="text" className="form-input" style={{ width: '100%' }} placeholder="Remote, Hybrid, On-site" value={jobFormData.type} onChange={e => setJobFormData({...jobFormData, type: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Experience</label>
                    <input required type="text" className="form-input" style={{ width: '100%' }} placeholder="e.g. 2-4 Years" value={jobFormData.experience} onChange={e => setJobFormData({...jobFormData, experience: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Salary</label>
                    <input required type="text" className="form-input" style={{ width: '100%' }} value={jobFormData.salary} onChange={e => setJobFormData({...jobFormData, salary: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Required Skills (comma separated)</label>
                  <input required type="text" className="form-input" style={{ width: '100%' }} placeholder="react, node, javascript" value={jobFormData.requiredSkills} onChange={e => setJobFormData({...jobFormData, requiredSkills: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Application Link (optional)</label>
                  <input type="url" className="form-input" style={{ width: '100%' }} placeholder="https://company.com/careers" value={jobFormData.applyLink} onChange={e => setJobFormData({...jobFormData, applyLink: e.target.value})} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => setJobModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Job</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
