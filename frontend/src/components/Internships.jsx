import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Internships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [stats, setStats] = useState({ totalSaved: 0, totalApplied: 0, interviewing: 0, offers: 0 });
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UX State
  const [toast, setToast] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [paidFilter, setPaidFilter] = useState(''); 
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/internships', {
        params: { search, paid: paidFilter, type: typeFilter, location: locationFilter }
      });
      setInternships(res.data);
    } catch (err) {
      setError('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/internships/applications/me');
      setMyApplications(res.data);
      const statRes = await axios.get('/api/internships/stats/me');
      setStats(statRes.data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'discover') {
      fetchInternships();
    } else {
      fetchMyApplications();
    }
  }, [activeTab, search, paidFilter, typeFilter, locationFilter]);

  const handleApplyOrSave = async (internshipId, status, externalLink) => {
    try {
      await axios.post(`/api/internships/${internshipId}/apply`, {
        status: status,
        appliedDate: status === 'Applied' ? new Date() : null
      });
      if (activeTab === 'applications') {
        fetchMyApplications();
      } else {
        triggerToast(`Internship ${status.toLowerCase()} successfully!`, 'success');
      }
    } catch (err) {
      console.error(err);
      triggerToast(`Unable to ${status.toLowerCase() === 'saved' ? 'save' : 'apply to'} internship`, 'error');
    }
  };

  const handleApplyNow = async (intern) => {
    if (!intern.applyLink || !intern.applyLink.startsWith('http')) {
      triggerToast("Application link unavailable for this internship.", "error");
      return false;
    }
    await handleApplyOrSave(intern._id, 'Applied', intern.applyLink);
    window.open(intern.applyLink, '_blank');
    return true;
  };

  const updateApplicationNote = async (appId, notes, newStatus) => {
    try {
      await axios.put(`/api/internships/applications/${appId}`, {
        notes, status: newStatus
      });
      fetchMyApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const selectStyle = { backgroundColor: '#1e293b', color: '#f8fafc', width: 'auto' };

  if (loading && internships.length === 0 && myApplications.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Internships...</div>;
  }

  return (
    <div className="job-recommendations-container" style={{ animation: 'fadeIn 0.5s ease-in-out', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          background: toast.type === 'error' ? 'var(--accent-red)' : 'var(--accent-emerald)',
          color: '#fff', padding: '1rem 1.5rem', borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedInternship && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex',
          justifyContent: 'center', alignItems: 'center', padding: '1rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{selectedInternship.title}</h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-blue)', fontSize: '1.1rem', fontWeight: '500' }}>{selectedInternship.company}</span>
                  {selectedInternship.companyWebsite && (
                    <a href={selectedInternship.companyWebsite} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'underline' }}>Website ↗</a>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedInternship(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📍 Location: {selectedInternship.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>🏠 Type: {selectedInternship.type}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>⏱ Duration: {selectedInternship.duration || 'N/A'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>💰 Stipend: {selectedInternship.stipend || 'Unpaid'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📅 Posted: {selectedInternship.postedDate ? new Date(selectedInternship.postedDate).toLocaleDateString() : 'N/A'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>⏳ Deadline: {selectedInternship.deadline ? new Date(selectedInternship.deadline).toLocaleDateString() : 'Rolling'}</span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>Description</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{selectedInternship.description || 'No description provided.'}</p>
            </div>

            {(selectedInternship.responsibilities && selectedInternship.responsibilities.length > 0) && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>Key Responsibilities</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                  {selectedInternship.responsibilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(selectedInternship.eligibility && selectedInternship.eligibility.length > 0) && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>Eligibility</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                  {selectedInternship.eligibility.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(selectedInternship.benefits && selectedInternship.benefits.length > 0) && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>Benefits & Learning Opportunities</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                  {selectedInternship.benefits.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>Required Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {selectedInternship.requirements.map((req, i) => (
                  <span key={i} style={{ padding: '0.3rem 0.6rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--accent-blue)' }}>{req}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedInternship(null)}>Close</button>
              <button className="btn btn-secondary" onClick={() => { handleApplyOrSave(selectedInternship._id, 'Saved', null); setSelectedInternship(null); }}>Save Internship</button>
              <button className="btn btn-primary" onClick={async () => { const success = await handleApplyNow(selectedInternship); if (success) setSelectedInternship(null); }}>Apply Now ↗</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Internships</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Find, save, and track your internship applications.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: '12px' }}>
          <button 
            className={`btn ${activeTab === 'discover' ? 'btn-primary' : ''}`}
            style={{ background: activeTab === 'discover' ? '' : 'transparent', border: 'none', color: activeTab === 'discover' ? '#fff' : 'var(--text-secondary)' }}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </button>
          <button 
            className={`btn ${activeTab === 'applications' ? 'btn-primary' : ''}`}
            style={{ background: activeTab === 'applications' ? '' : 'transparent', border: 'none', color: activeTab === 'applications' ? '#fff' : 'var(--text-secondary)' }}
            onClick={() => setActiveTab('applications')}
          >
            My Applications
          </button>
        </div>
      </div>

      {activeTab === 'discover' ? (
        <>
          {/* Filters */}
          <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by role, company, skill or location..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ flex: '1', minWidth: '250px' }}
            />
            <select className="form-input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
              <option value="" style={selectStyle}>All Types</option>
              <option value="Remote" style={selectStyle}>Remote</option>
              <option value="Hybrid" style={selectStyle}>Hybrid</option>
              <option value="On-site" style={selectStyle}>On-site</option>
            </select>
            <select className="form-input" value={paidFilter} onChange={e => setPaidFilter(e.target.value)} style={selectStyle}>
              <option value="" style={selectStyle}>Paid & Unpaid</option>
              <option value="true" style={selectStyle}>Paid Only</option>
              <option value="false" style={selectStyle}>Unpaid Only</option>
            </select>
          </div>

          {/* Listings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {internships.map(intern => (
              <div key={intern._id} className="glass-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{intern.title}</h3>
                      <div style={{ color: 'var(--accent-blue)', fontSize: '0.95rem', fontWeight: '500' }}>{intern.company}</div>
                    </div>
                    {intern.paid && (
                      <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>PAID</span>
                    )}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📍 {intern.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>🏠 {intern.type}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>⏱ {intern.duration || 'N/A'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>💰 {intern.stipend || 'Unpaid'}</span>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Requirements</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {intern.requirements.slice(0, 3).map((req, i) => (
                        <span key={i} style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{req}</span>
                      ))}
                      {intern.requirements.length > 3 && (
                        <span style={{ padding: '0.2rem 0.5rem', background: 'transparent', fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{intern.requirements.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ flex: 1, padding: '0.5rem' }}
                    onClick={() => setSelectedInternship(intern)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ flex: 1, padding: '0.5rem' }}
                    onClick={() => handleApplyOrSave(intern._id, 'Saved', null)}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1.5, padding: '0.5rem' }}
                    onClick={() => handleApplyNow(intern)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
            {internships.length === 0 && !loading && <p style={{ color: 'var(--text-secondary)' }}>No internships found.</p>}
          </div>
        </>
      ) : (
        <>
          {/* Dashboard Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{stats.totalSaved}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Saved</div>
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-emerald)' }}>{stats.totalApplied}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Applied</div>
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#eab308' }}>{stats.interviewing}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Interviewing</div>
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7' }}>{stats.offers}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Selected</div>
            </div>
          </div>

          {/* Applications List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myApplications.map(app => (
              <div key={app._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{app.internship?.title}</h4>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.internship?.company}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Applied: {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary" onClick={() => setSelectedInternship(app.internship)}>View Details</button>
                  <select 
                    className="form-input" 
                    value={app.status} 
                    onChange={(e) => updateApplicationNote(app._id, app.notes, e.target.value)}
                    style={selectStyle}
                  >
                    <option value="Saved" style={selectStyle}>Saved</option>
                    <option value="Applied" style={selectStyle}>Applied</option>
                    <option value="Interview" style={selectStyle}>Interview</option>
                    <option value="Selected" style={selectStyle}>Selected</option>
                    <option value="Rejected" style={selectStyle}>Rejected</option>
                    <option value="Withdrawn" style={selectStyle}>Withdrawn</option>
                  </select>
                  
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Notes..." 
                    value={app.notes} 
                    onChange={(e) => {
                      const newApps = [...myApplications];
                      const idx = newApps.findIndex(a => a._id === app._id);
                      newApps[idx].notes = e.target.value;
                      setMyApplications(newApps);
                    }}
                    onBlur={(e) => updateApplicationNote(app._id, e.target.value, app.status)}
                    style={{ width: '200px' }}
                  />
                </div>
              </div>
            ))}
            {myApplications.length === 0 && !loading && <p style={{ color: 'var(--text-secondary)' }}>No applications or saved internships yet.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default Internships;