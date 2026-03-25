import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../utils/api';

// Wrapper style (unchanged)
const wrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100%',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  background: 'linear-gradient(135deg, #0a192f 0%, #1e3a5f 100%)',
  padding: '20px', 
  boxSizing: 'border-box'
};

// Page container style (unchanged)
const pageStyle = {
  padding: '40px',
  maxWidth: '700px', 
  width: '100%',
  background: '#1c2a3f', 
  color: 'white',
  borderRadius: '20px', 
  border: '1px solid #4a5b70', 
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', 
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px' 
};

// Updated inputs: taller padding and 100% width
const inputStyle = {
  padding: '18px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #4a5b70', 
  background: '#2a3b50', 
  color: 'white',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  width: '100%',
  boxSizing: 'border-box'
};

// Updated textarea: taller minHeight
const textareaStyle = {
  ...inputStyle,
  minHeight: '400px',
  resize: 'vertical',
};

const buttonStyle = {
  padding: '12px 20px',
  background: 'linear-gradient(135deg, #0052D4 0%, #4364F7 100%)', 
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600'
};

const errorStyle = {
  color: '#f44336',
  background: 'rgba(244, 67, 54, 0.1)',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #f44336',
  textAlign: 'center'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#eee'
};

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl('/api/posts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
        credentials: 'include' 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }
      
      navigate('/community');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={pageStyle}>
        <h1 style={{ 
          borderBottom: '1px solid #4a5b70', 
          paddingBottom: '15px',
          textAlign: 'center', 
          fontSize: '2.2rem',
          margin: '0 0 30px 0'
        }}>
          Create a New Post
        </h1>
        
        {error && <p style={errorStyle}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label htmlFor="title" style={labelStyle}>Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              placeholder="Your post title"
              required
            />
          </div>
          <div>
            <label htmlFor="content" style={labelStyle}>Content</label>
            <textarea
              id="content"
              value={content}
              // --- THIS IS THE FIX ---
              onChange={(e) => setContent(e.target.value)} // Removed the "g."
              style={textareaStyle}
              placeholder="What's on your mind?"
              required
            />
          </div>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Posting...' : 'Create Post'}
          </button>
        </form>
        
        <button 
          onClick={() => navigate('/community')} 
          style={{
            ...buttonStyle, 
            background: '#2a3b50', 
            border: '1px solid #4a5b70',
            marginTop: '15px', 
            width: '100%'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
