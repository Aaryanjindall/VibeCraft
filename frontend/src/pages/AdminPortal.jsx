import React, { useEffect, useState } from 'react';
import { apiUrl } from '../utils/api';
import { motion } from 'framer-motion';

const baseCard = {
  background: 'linear-gradient(180deg, rgba(30,41,59,0.85), rgba(15,23,42,0.92))',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: '14px',
  padding: '14px',
  color: '#e5e7eb'
};

const AdminPortal = () => {
  const [email, setEmail] = useState('admin@aivibe.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);

  const fetchOverview = async () => {
    try {
      const response = await fetch(apiUrl('/api/admin/overview'), { credentials: 'include' });
      if (!response.ok) return;
      const data = await response.json();
      setOverview(data);
    } catch (err) {
      console.error('Failed to load admin overview', err);
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoadingTables(true);
      const [usersRes, postsRes] = await Promise.all([
        fetch(apiUrl('/api/admin/users'), { credentials: 'include' }),
        fetch(apiUrl('/api/admin/posts'), { credentials: 'include' })
      ]);
      if (usersRes.ok) {
        setUsers(await usersRes.json());
      }
      if (postsRes.ok) {
        setPosts(await postsRes.json());
      }
    } catch (err) {
      console.error('Failed to load admin users/posts', err);
    } finally {
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchAdminData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Admin login failed');
      }

      setStatus('✅ Admin verified. Overview loaded below.');
      await Promise.all([fetchOverview(), fetchAdminData()]);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(148,163,184,0.35)',
    background: 'rgba(15,23,42,0.85)',
    color: '#e5e7eb',
    marginTop: '6px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
    color: '#0b1224',
    fontWeight: 800,
    cursor: 'pointer',
    marginTop: '4px',
    boxShadow: '0 12px 30px rgba(99,102,241,0.35)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.15), transparent 35%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.12), transparent 35%), linear-gradient(135deg, #0b1224, #0f172a)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      color: '#e5e7eb',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }}
        style={{
          width: '100%',
          maxWidth: '1100px',
          background: 'rgba(15,23,42,0.92)',
          border: '1px solid rgba(148,163,184,0.25)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '10px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#fff' }}>Admin Portal</h1>
            <p style={{ margin: '4px 0 0', color: '#cbd5e1' }}>Manage users, posts, and monitor activity.</p>
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '999px',
            background: 'rgba(37,99,235,0.12)',
            border: '1px solid rgba(59,130,246,0.35)',
            color: '#bfdbfe',
            fontSize: '12px'
          }}>
            🛡️ 
          </span>
        </div>

        <motion.form onSubmit={handleLogin} style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'end' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}>
          <div>
            <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Password</label>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              required
            />
          </div>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </motion.form>

        {status && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: status.startsWith('✅') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(248, 113, 113, 0.12)',
              border: `1px solid ${status.startsWith('✅') ? 'rgba(16,185,129,0.6)' : 'rgba(248,113,113,0.6)'}`,
              color: status.startsWith('✅') ? '#34d399' : '#fca5a5',
              marginBottom: '12px'
            }}
          >
            {status}
          </motion.div>
        )}

        {overview && (
          <div style={{ marginTop: '8px' }}>
            <h3 style={{ marginBottom: '12px', color: '#fff' }}>Snapshot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { label: 'Users', value: overview.userCount, color: '#38bdf8' },
                { label: 'Posts', value: overview.postCount, color: '#a78bfa' },
                { label: 'Communities', value: overview.communityCount, color: '#34d399' },
              ].map((item, idx) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }} style={{ ...baseCard, padding: '14px' }}>
                  <p style={{ margin: '0 0 4px', color: '#cbd5e1' }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: item.color }}>{item.value}</p>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1.1fr 1.2fr', gap: '16px' }}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} style={{ ...baseCard, padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>Users</h3>
                  {loadingTables && <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Loading…</span>}
                </div>
                {users.length === 0 ? (
                  <p style={{ color: '#cbd5e1' }}>No users yet.</p>
                ) : (
                  <div style={{ maxHeight: '240px', overflowY: 'auto', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.18)' }}>
                    {users.map(u => (
                      <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid rgba(148,163,184,0.1)', background: 'rgba(8,15,30,0.8)' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>{u.username || '(no name)'}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{u.email}</div>
                        </div>
                        <button
                          onClick={async () => {
                            if (!window.confirm('Delete this user and all of their posts?')) return;
                            try {
                              await fetch(apiUrl(`/api/admin/users/${u._id}`), { method: 'DELETE', credentials: 'include' });
                              setUsers(prev => prev.filter(x => x._id !== u._id));
                              setPosts(prev => prev.filter(p => p.author?._id !== u._id));
                              setStatus('✅ User deleted');
                            } catch (err) {
                              console.error('Delete user failed', err);
                              setStatus('❌ Failed to delete user');
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(248,113,113,0.4)',
                            background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} style={{ ...baseCard, padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>All posts</h3>
                  {loadingTables && <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Loading…</span>}
                </div>
                {posts.length === 0 ? (
                  <p style={{ color: '#cbd5e1' }}>No posts yet.</p>
                ) : (
                  <div style={{ maxHeight: '240px', overflowY: 'auto', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.18)' }}>
                    {posts.map(p => (
                      <div key={p._id} style={{ padding: '10px', borderBottom: '1px solid rgba(148,163,184,0.1)', background: 'rgba(8,15,30,0.8)', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>{p.title}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {p.author?.username || 'Unknown'} • {new Date(p.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (!window.confirm('Delete this post?')) return;
                            try {
                              await fetch(apiUrl(`/api/admin/posts/${p._id}`), { method: 'DELETE', credentials: 'include' });
                              setPosts(prev => prev.filter(x => x._id !== p._id));
                              setStatus('✅ Post deleted');
                            } catch (err) {
                              console.error('Delete post failed', err);
                              setStatus('❌ Failed to delete post');
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(248,113,113,0.4)',
                            background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '11px',
                            height: 'fit-content'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPortal;

