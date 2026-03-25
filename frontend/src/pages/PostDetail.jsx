// frontend/src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl } from '../utils/api';

// Re-using styles
const pageStyle = {
  padding: '20px',
  maxWidth: '800px',
  margin: '20px auto',
  backgroundColor: '#1e1e1e',
  color: 'white',
  borderRadius: '10px',
  fontFamily: 'sans-serif',
  border: '1px solid #333'
};

const buttonStyle = {
  padding: '10px 15px',
  background: 'linear-gradient(135deg, #26207bff 0%, #6b5a62ff 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  textDecoration: 'none',
  fontWeight: '600'
};

const postContentStyle = {
  padding: '20px',
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  border: '1px solid #333',
  whiteSpace: 'pre-wrap', // Preserve line breaks
  lineHeight: '1.6',
  fontSize: '16px'
};

const postMetaStyle = {
  fontSize: '12px',
  color: '#aaa',
  marginBottom: '20px'
};

const commentSectionStyle = {
  marginTop: '30px',
  borderTop: '1px solid #333',
  paddingTop: '20px'
};

const commentItemStyle = {
  backgroundColor: '#2a2a2a',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '10px',
  border: '1px solid #333'
};

const commentMetaStyle = {
  fontSize: '12px',
  color: '#aaa',
  fontWeight: 'bold'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginTop: '20px'
};

const textareaStyle = {
  padding: '12px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #444',
  backgroundColor: '#2a2a2a',
  color: 'white',
  minHeight: '80px',
  fontFamily: 'sans-serif'
};

const errorStyle = {
  color: '#f44336',
  textAlign: 'center',
  margin: '10px 0'
};

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(apiUrl(`/api/posts/${postId}`), {
          credentials: 'include'
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError(null);

    try {
      const response = await fetch(apiUrl(`/api/posts/${postId}/comments`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add comment');
      }
      
      // Update post state with new comment list
      setPost(data); 
      setCommentText(''); // Clear textarea
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <div style={pageStyle}>Loading post...</div>;
  if (error) return <div style={pageStyle}>Error: {error}</div>;
  if (!post) return <div style={pageStyle}>Post not found.</div>;

  return (
    <div style={pageStyle}>
      <button onClick={() => navigate('/community')} style={{...buttonStyle, background: '#555', marginBottom: '20px'}}>
        ← Back to Feed
      </button>

      <h1 style={{ marginBottom: '10px' }}>{post.title}</h1>
      <p style={postMetaStyle}>
        By: {post.author?.username || 'Unknown'} on {new Date(post.createdAt).toLocaleString()}
      </p>
      <div style={postContentStyle}>
        {post.content}
      </div>

      <div style={commentSectionStyle}>
        <h2>Comments ({post.comments.length})</h2>
        
        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} style={formStyle}>
          <label htmlFor="comment">Add a comment:</label>
          <textarea
            id="comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={textareaStyle}
            placeholder="Add your comment..."
            required
          />
          {commentError && <p style={errorStyle}>{commentError}</p>}
          <button type="submit" style={{...buttonStyle, alignSelf: 'flex-start'}} disabled={commentLoading}>
            {commentLoading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comment List */}
        <div style={{ marginTop: '20px' }}>
          {post.comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            // Sort comments to show newest first
            post.comments.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(comment => (
              <div key={comment._id} style={commentItemStyle}>
                <p style={{ margin: '0 0 10px 0' }}>{comment.text}</p>
                <p style={commentMetaStyle}>
                  - {comment.author?.username || 'Unknown'} on {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;