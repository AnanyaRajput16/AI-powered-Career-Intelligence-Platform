Created At: 2026-07-09T15:19:29Z
Completed At: 2026-07-09T15:19:30Z
File Path: `file:///C:/Users/2k23c/.gemini/antigravity/scratch/career-intelligence-platform/frontend/src/components/Sidebar.jsx`
Total Lines: 145
Total Bytes: 5842
Showing lines 1 to 145
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import React from 'react';
2: import { Link, useNavigate, useLocation } from 'react-router-dom';
3: import { useAuth } from '../context/AuthContext';
4: 
5: const Sidebar = ({ isOpen, toggleSidebar }) => {
6:   const { user, logout } = useAuth();
7:   const navigate = useNavigate();
8:   const location = useLocation();
9: 
10:   const handleLogout = () => {
11:     logout();
12:     navigate('/');
13:     if (toggleSidebar) toggleSidebar();
14:   };
15: 
16:   const getInitials = (name) => {
17:     if (!name) return 'U';
18:     return name
19:       .split(' ')
20:       .map((n) => n[0])
21:       .join('')
22:       .toUpperCase()
23:       .slice(0, 2);
24:   };
25: 
26:   const menuItems = [
27:     {
28:       name: 'Overview',
29:       path: '/dashboard',
30:       icon: (
31:         <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
32:           <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path>
33:         </svg>
34:       )
35:     },
36:     {
37:       name: 'Resume Analyzer',
38:       path: '#resume-analyzer',
39:       icon: (
40:         <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
41:           <path strokeLine
<truncated 2943 bytes>
> toggleSidebar && toggleSidebar()}
96:                   className={`sidebar-link ${isActive ? 'active' : ''}`}
97:                 >
98:                   {item.icon}
99:                   <span>{item.name}</span>
100:                 </a>
101:               ) : (
102:                 <Link
103:                   to={item.path}
104:                   onClick={() => toggleSidebar && toggleSidebar()}
105:                   className={`sidebar-link ${isActive ? 'active' : ''}`}
106:                 >
107:                   {item.icon}
108:                   <span>{item.name}</span>
109:                 </Link>
110:               )}
111:             </li>
112:           );
113:         })}
114:       </ul>
115: 
116:       <div className="sidebar-footer">
117:         {user && (
118:           <div className="user-mini-profile">
119:             <div className="user-avatar-circle">
120:               {getInitials(user.name)}
121:             </div>
122:             <div className="user-mini-info">
123:               <span className="user-mini-name">{user.name}</span>
124:               <span className="user-mini-role">{user.email}</span>
125:             </div>
126:           </div>
127:         )}
128:         <button
129:           onClick={handleLogout}
130:           className="btn btn-secondary"
131:           style={{ width: '100%', justifyContent: 'flex-start' }}
132:           id="sidebar-logout-btn"
133:         >
134:           <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
135:             <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
136:           </svg>
137:           <span>Sign Out</span>
138:         </button>
139:       </div>
140:     </aside>
141:   );
142: };
143: 
144: export default Sidebar;
145: 
The above content shows the entire, complete file contents of the requested file.
