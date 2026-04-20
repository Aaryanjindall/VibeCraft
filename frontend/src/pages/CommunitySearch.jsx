// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiUrl } from '../utils/api';

// const wrapperStyle = {
//   minHeight: '100vh',
//   background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.18), transparent 35%), radial-gradient(circle at 80% 10%, rgba(236,72,153,0.16), transparent 35%), linear-gradient(135deg, #0b1224, #0f172a)',
//   padding: '32px 0',
//   color: '#e5e7eb',
//   fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
// };

// const pageStyle = {
//   maxWidth: '1200px',
//   margin: '0 auto',
//   padding: '32px',
//   background: 'rgba(15,23,42,0.88)',
//   border: '1px solid rgba(148,163,184,0.18)',
//   boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
//   borderRadius: '20px',
//   backdropFilter: 'blur(10px)'
// };

// const headerStyle = {
//   marginBottom: '24px'
// };

// const headline = {
//   margin: 0,
//   fontSize: '32px',
//   fontWeight: 800,
//   color: '#fff',
//   marginBottom: '8px'
// };

// const subhead = {
//   margin: 0,
//   color: '#cbd5e1',
//   fontSize: '16px'
// };

// const searchContainer = {
//   marginBottom: '24px',
//   background: 'rgba(30,41,59,0.6)',
//   padding: '20px',
//   borderRadius: '16px',
//   border: '1px solid rgba(148,163,184,0.2)'
// };

// const inputGroup = {
//   display: 'flex',
//   gap: '12px',
//   marginBottom: '12px'
// };

// const inputStyle = {
//   flex: 1,
//   padding: '14px 16px',
//   borderRadius: '12px',
//   border: '1px solid rgba(148,163,184,0.3)',
//   background: 'rgba(15,23,42,0.8)',
//   color: '#e5e7eb',
//   fontSize: '14px',
//   outline: 'none'
// };

// const buttonStyle = {
//   padding: '14px 24px',
//   background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
//   color: '#0b1224',
//   border: 'none',
//   borderRadius: '12px',
//   fontWeight: 700,
//   cursor: 'pointer',
//   boxShadow: '0 10px 30px rgba(99,102,241,0.35)',
//   fontSize: '14px'
// };

// const communityCard = {
//   background: 'linear-gradient(180deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))',
//   border: '1px solid rgba(148,163,184,0.2)',
//   borderRadius: '16px',
//   padding: '24px',
//   marginBottom: '16px'
// };

// const cardHeader = {
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'flex-start',
//   marginBottom: '16px',
//   gap: '16px'
// };

// const cardTitle = {
//   fontSize: '20px',
//   fontWeight: 800,
//   margin: 0,
//   color: '#fff'
// };

// const cardId = {
//   fontSize: '14px',
//   color: '#22d3ee',
//   fontWeight: 600,
//   fontFamily: 'monospace',
//   background: 'rgba(34,211,238,0.1)',
//   padding: '6px 12px',
//   borderRadius: '8px'
// };

// const cardMeta = {
//   display: 'flex',
//   gap: '16px',
//   color: '#94a3b8',
//   fontSize: '14px',
//   marginBottom: '16px'
// };

// const joinButton = {
//   padding: '10px 20px',
//   background: 'linear-gradient(135deg, #22c55e, #16a34a)',
//   color: '#fff',
//   border: 'none',
//   borderRadius: '10px',
//   fontWeight: 700,
//   cursor: 'pointer',
//   fontSize: '13px'
// };

// const leaveButton = {
//   ...joinButton,
//   background: 'linear-gradient(135deg, #ef4444, #b91c1c)'
// };

// const chatButton = {
//   ...joinButton,
//   background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
//   marginLeft: '8px'
// };

// const CommunitySearch = () => {
//   const [projectId, setProjectId] = useState('');
//   const [community, setCommunity] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [joined, setJoined] = useState(false);
//   const { user } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (community && user) {
//       const isMember = community.members?.some(
//         m => m._id === user._id || m.toString() === user._id?.toString()
//       );
//       setJoined(isMember);
//     }
//   }, [community, user]);

//   const handleSearch = async () => {
//     if (!projectId.trim()) {
//       setError('Please enter a Project ID');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setCommunity(null);

//     try {
//       const response = await fetch(apiUrl(`/api/communities/${projectId.trim()}`), {
//         credentials: 'include'
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setCommunity(data);
//       } else {
//         const data = await response.json();
//         setError(data.error || 'Community not found for this Project ID');
//       }
//     } catch (err) {
//       setError('Failed to search community');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleJoin = async () => {
//     if (!user) {
//       setError('Please log in to join community');
//       return;
//     }

//     try {
//       const response = await fetch(apiUrl(`/api/communities/${projectId}/join`), {
//         method: 'POST',
//         credentials: 'include'
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setCommunity(data.community);
//         setJoined(true);
//         setError('');
//       } else {
//         const data = await response.json();
//         setError(data.error || 'Failed to join community');
//       }
//     } catch (err) {
//       setError('Failed to join community');
//       console.error(err);
//     }
//   };

//   const handleLeave = async () => {
//     try {
//       const response = await fetch(apiUrl(`/api/communities/${projectId}/leave`), {
//         method: 'POST',
//         credentials: 'include'
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setCommunity(data.community);
//         setJoined(false);
//         setError('');
//       } else {
//         const data = await response.json();
//         setError(data.error || 'Failed to leave community');
//       }
//     } catch (err) {
//       setError('Failed to leave community');
//       console.error(err);
//     }
//   };

//   return (
//     <div style={wrapperStyle}>
//       <div style={pageStyle}>
//         <div style={headerStyle}>
//           <h1 style={headline}>🔍 Search Project Community</h1>
//           <p style={subhead}>Enter a Project ID to find and join its community</p>
//         </div>

//         <div style={searchContainer}>
//           <div style={inputGroup}>
//             <input
//               type="text"
//               placeholder="Enter Project ID (e.g., abc123xy)"
//               style={inputStyle}
//               value={projectId}
//               onChange={(e) => setProjectId(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             />
//             <button onClick={handleSearch} style={buttonStyle} disabled={loading}>
//               {loading ? 'Searching...' : '🔍 Search'}
//             </button>
//           </div>
//           {error && (
//             <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
//               {error}
//             </div>
//           )}
//         </div>

//         {community && (
//           <div style={communityCard}>
//             <div style={cardHeader}>
//               <div>
//                 <h2 style={cardTitle}>{community.projectName}</h2>
//                 <div style={cardId}>Project ID: {community.projectId}</div>
//               </div>
//             </div>
            
//             <div style={cardMeta}>
//               <span>👥 {community.members?.length || 0} Members</span>
//               <span>📅 Created {new Date(community.createdAt).toLocaleDateString()}</span>
//               <span>👤 By {community.createdBy?.username || 'Unknown'}</span>
//             </div>

//             {community.description && (
//               <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
//                 {community.description}
//               </p>
//             )}

//             <div style={{ display: 'flex', gap: '8px' }}>
//               {!joined ? (
//                 <button onClick={handleJoin} style={joinButton} disabled={!user}>
//                   {user ? '✅ Join Community' : '🔑 Login to Join'}
//                 </button>
//               ) : (
//                 <>
//                   <button onClick={handleLeave} style={leaveButton}>
//                     ❌ Leave Community
//                   </button>
//                   <button 
//                     onClick={() => navigate(`/community/chat/${community.projectId}`)} 
//                     style={chatButton}
//                   >
//                     💬 Open Chat
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         <button 
//           onClick={() => navigate('/community')} 
//           style={{...buttonStyle, background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)', marginTop: '24px'}}
//         >
//           ← Back to Community Feed
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CommunitySearch;
