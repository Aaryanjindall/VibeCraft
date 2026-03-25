import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../utils/api';

// Re-using the styles from your other pages for consistency
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

const inputStyle = {
  padding: '16px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #4a5b70',
  background: '#2a3b50',
  color: 'white',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  width: '100%',
  boxSizing: 'border-box'
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '150px',
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

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#eee'
};


const CreateCommunity = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl('/api/communities'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create community');
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
        <h1 style={{ textAlign: 'center', borderBottom: '1px solid #4a5b70', paddingBottom: '15px', margin: '0 0 30px 0' }}>
          Create a New Community
        </h1>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label htmlFor="community-name" style={labelStyle}>Community Name</label>
            <input
              id="community-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., React Developers"
              style={inputStyle}
              required
            />
          </div>
          {error && (
            <p style={{ color: '#fca5a5', background: '#451a1a', padding: '10px', borderRadius: '8px', border: '1px solid #f87171', textAlign: 'center' }}>
              {error}
            </p>
          )}
          <div>
            <label htmlFor="community-desc" style={labelStyle}>Description</label>
            <textarea
              id="community-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this community about?"
              style={textareaStyle}
            />
          </div>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Creating...' : 'Create Community'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
