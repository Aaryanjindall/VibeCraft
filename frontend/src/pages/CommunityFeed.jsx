import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHashCode } from '../utils/helpers';
import { apiUrl } from '../utils/api';

// New styles
const wrapperStyle = {
  minHeight: '100vh',
  background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.18), transparent 35%), radial-gradient(circle at 80% 10%, rgba(236,72,153,0.16), transparent 35%), linear-gradient(135deg, #0b1224, #0f172a)',
  padding: '32px 0',
  color: '#e5e7eb',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
};

const pageStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '32px',
  background: 'rgba(15,23,42,0.88)',
  border: '1px solid rgba(148,163,184,0.18)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  borderRadius: '20px',
  backdropFilter: 'blur(10px)'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '20px'
};

const headerText = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const headline = {
  margin: 0,
  fontSize: '28px',
  fontWeight: 800,
  color: '#fff'
};

const subhead = {
  margin: 0,
  color: '#cbd5e1'
};

const buttonStyle = {
  padding: '12px 16px',
  background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
  color: '#0b1224',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0 10px 30px rgba(99,102,241,0.35)'
};

const controlsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '20px'
};

const searchBarStyle = {
  flex: '1 1 260px',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid rgba(148,163,184,0.3)',
  background: 'rgba(15,23,42,0.8)',
  color: '#e5e7eb',
  fontSize: '14px'
};

const sortTabsStyle = {
  display: 'inline-flex',
  borderRadius: '12px',
  border: '1px solid rgba(148,163,184,0.3)',
  overflow: 'hidden'
};

const tabStyle = {
  padding: '10px 14px',
  background: 'transparent',
  color: '#cbd5e1',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 700
};

const activeTabStyle = {
  ...tabStyle,
  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(14,165,233,0.25))',
  color: '#fff'
};

const postGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '16px',
  marginTop: '10px'
};

const card = {
  background: 'linear-gradient(180deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: '16px',
  padding: '18px',
  color: '#e5e7eb',
  textDecoration: 'none',
  display: 'block',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

const cardMeta = {
  fontSize: '12px',
  color: '#94a3b8',
  marginBottom: '8px'
};

const cardTitle = {
  fontSize: '18px',
  fontWeight: 800,
  margin: '0 0 8px 0',
  color: '#fff'
};

const cardSnippet = {
  fontSize: '14px',
  color: '#cbd5e1',
  margin: '0 0 12px 0',
  lineHeight: 1.5
};

const chipRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '12px',
  color: '#94a3b8',
  borderTop: '1px solid rgba(148,163,184,0.15)',
  paddingTop: '10px'
};

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(apiUrl('/api/posts'), {
          credentials: 'include'
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredAndSortedPosts = posts
    .filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  if (loading) return <div style={{...wrapperStyle, ...pageStyle, textAlign: 'center'}}>Loading posts...</div>;
  if (error) return <div style={{...wrapperStyle, ...pageStyle, textAlign: 'center'}}>Error: {error}</div>;

  return (
    <div style={wrapperStyle}>
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div style={headerText}>
            <h1 style={headline}>Community Feed</h1>
            <p style={subhead}>Discover what others are building, ask for feedback, and share ideas.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/community/search" style={{...buttonStyle, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
              <span>🔍</span> Search Project
            </Link>
            <Link to="/community/new" style={buttonStyle}>
              <span>✍️</span> New Post
            </Link>
          </div>
        </div>

        <div style={controlsStyle}>
          <input
            type="text"
            placeholder="Search posts…"
            style={searchBarStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={sortTabsStyle}>
            <button
              style={sortType === 'newest' ? activeTabStyle : tabStyle}
              onClick={() => setSortType('newest')}
            >
              Newest
            </button>
            <button
              style={sortType === 'oldest' ? activeTabStyle : tabStyle}
              onClick={() => setSortType('oldest')}
            >
              Oldest
            </button>
          </div>
        </div>

        {filteredAndSortedPosts.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>{searchTerm ? 'No posts match your search.' : 'No posts yet. Be the first to create one!'}</p>
        ) : (
          <div style={postGrid}>
            {filteredAndSortedPosts.map(post => (
              <Link
                key={post._id}
                to={`/community/post/${post._id}`}
                style={card}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <p style={cardMeta}>
                  {post.author?.username || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <h2 style={cardTitle}>{post.title}</h2>
                <p style={cardSnippet}>
                  {post.content.substring(0, 140)}{post.content.length > 140 ? '…' : ''}
                </p>
                <div style={chipRow}>
                  <span>💬 {Math.abs(getHashCode(post._id) % 20)} comments</span>
                  <span>🕒 {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <button onClick={() => navigate('/app')} style={{...buttonStyle, background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)', color: '#0b1224', marginTop: '24px'}}>
          ← Back to Builder
        </button>
      </div>
    </div>
  );
};

export default CommunityFeed;

