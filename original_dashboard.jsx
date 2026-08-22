Created At: 2026-07-09T15:19:19Z
Completed At: 2026-07-09T15:19:20Z
File Path: `file:///C:/Users/2k23c/.gemini/antigravity/scratch/career-intelligence-platform/frontend/src/pages/Dashboard.jsx`
Total Lines: 284
Total Bytes: 14700
Showing lines 1 to 284
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import React, { useState, useEffect } from 'react';
2: import { useNavigate } from 'react-router-dom';
3: import { useAuth } from '../context/AuthContext';
4: import Sidebar from '../components/Sidebar';
5: 
6: const Dashboard = () => {
7:   const { user, loading } = useAuth();
8:   const navigate = useNavigate();
9:   const [sidebarOpen, setSidebarOpen] = useState(false);
10: 
11:   // Quick Action Click Responders
12:   const handleQuickAction = (action) => {
13:     alert(`Quick Action Triggered: ${action}\nThis feature simulation is active for Milestone 1 evaluation.`);
14:   };
15: 
16:   // Guard routing - redirect to login if unauthenticated
17:   useEffect(() => {
18:     if (!loading && !user) {
19:       navigate('/login');
20:     }
21:   }, [user, loading, navigate]);
22: 
23:   if (loading) {
24:     return (
25:       <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
26:         <svg style={{ width: '3rem', height: '3rem', animation: 'spin 1s linear infinite', stroke: 'var(--accent-blue)' }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
27:           <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
28:           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
29:         </svg>
30:         <span style={{ color: 'var(--text-secondary)' }}>Loading Career Intel...</span>
31:         <style>{`
32:           @keyframes spin { 100% { transfor
<truncated 12494 bytes>
   ].map((bar, index) => (
246:                 <div className="chart-bar-group" key={index}>
247:                   <div
248:                     className="chart-bar-visual"
249:                     style={{ height: bar.ht }}
250:                     data-val={bar.val}
251:                   ></div>
252:                   <span className="chart-bar-label">{bar.label}</span>
253:                 </div>
254:               ))}
255:             </div>
256:           </div>
257: 
258:           {/* Recent Activity Logs */}
259:           <div className="glass-card" id="activity-card">
260:             <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Recent Log Activity</h3>
261:             <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
262:               {[
263:                 { time: 'Just now', event: 'Profile verification linked' },
264:                 { time: '10 mins ago', event: 'AI evaluation database connected' },
265:                 { time: '1 hour ago', event: 'MERN credentials registered' }
266:               ].map((act, index) => (
267:                 <li key={index} style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
268:                   <span style={{ color: 'var(--text-muted)', minWidth: '70px' }}>{act.time}</span>
269:                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
270:                     <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{act.event}</span>
271:                     <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>System code validation checked</span>
272:                   </div>
273:                 </li>
274:               ))}
275:             </ul>
276:           </div>
277:         </div>
278:       </main>
279:     </div>
280:   );
281: };
282: 
283: export default Dashboard;
284: 
The above content shows the entire, complete file contents of the requested file.
