import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await axios.post('/api/feedback', { subject, message });
      setStatus({ type: 'success', text: 'Thank you for your feedback!' });
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to submit feedback.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', animation: 'fadeIn 0.5s ease-in-out' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Platform Feedback</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Help us improve Career Intelligence by sharing your thoughts, feature requests, or bug reports.
      </p>

      {status && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '4px', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? 'var(--accent-emerald)' : '#ef4444', border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Subject</label>
          <input 
            type="text" 
            required 
            className="form-input" 
            style={{ width: '100%', maxWidth: '500px' }} 
            placeholder="What is this regarding?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Message</label>
          <textarea 
            required 
            className="form-input" 
            style={{ width: '100%', maxWidth: '600px', minHeight: '150px', resize: 'vertical' }} 
            placeholder="Please provide details..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
