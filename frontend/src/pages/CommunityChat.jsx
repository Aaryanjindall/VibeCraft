import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { apiUrl } from '../utils/api';
import { useUser } from '../context/UserProvider';


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
  backdropFilter: 'blur(10px)',
  height: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '20px',
  paddingBottom: '16px',
  borderBottom: '1px solid rgba(148,163,184,0.2)'
};

const headline = {
  margin: 0,
  fontSize: '28px',
  fontWeight: 800,
  color: '#fff'
};

const subhead = {
  margin: 0,
  color: '#cbd5e1',
  fontSize: '14px'
};

const chatContainer = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'rgba(15,23,42,0.5)',
  borderRadius: '12px',
  border: '1px solid rgba(148,163,184,0.15)'
};

const messagesContainer = {
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const messageStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(30,41,59,0.7)',
  border: '1px solid rgba(148,163,184,0.1)',
  maxWidth: '75%',
  wordWrap: 'break-word'
};

const ownMessageStyle = {
  ...messageStyle,
  alignSelf: 'flex-end',
  background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(14,165,233,0.3))',
  border: '1px solid rgba(99,102,241,0.4)'
};

const otherMessageStyle = {
  ...messageStyle,
  alignSelf: 'flex-start'
};

const messageHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  color: '#94a3b8'
};

const messageAuthor = {
  fontWeight: 700,
  color: '#22d3ee'
};

const messageTime = {
  fontSize: '11px',
  color: '#64748b'
};

const messageText = {
  color: '#e5e7eb',
  fontSize: '14px',
  lineHeight: 1.6,
  margin: 0
};

const inputContainer = {
  display: 'flex',
  gap: '12px',
  padding: '16px 20px',
  borderTop: '1px solid rgba(148,163,184,0.2)',
  background: 'rgba(15,23,42,0.8)'
};

const inputStyle = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(148,163,184,0.3)',
  background: 'rgba(30,41,59,0.6)',
  color: '#e5e7eb',
  fontSize: '14px',
  outline: 'none'
};

const buttonStyle = {
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
  color: '#0b1224',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 10px 30px rgba(99,102,241,0.35)'
};

const loadingStyle = {
  textAlign: 'center',
  color: '#cbd5e1',
  padding: '20px'
};

const errorStyle = {
  textAlign: 'center',
  color: '#ef4444',
  padding: '20px',
  background: 'rgba(239,68,68,0.1)',
  borderRadius: '8px',
  margin: '20px'
};

const CommunityChat = () => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useUser();
  const navigate = useNavigate();

  const chatProjectId = projectId || 'general';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (!user) {
      setError('Please log in to use chat');
      setLoading(false);
      return;
    }

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const newSocket = io(API_BASE, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    // Load chat history
    const loadHistory = async () => {
      try {
        const response = await fetch(apiUrl('/api/chat'), {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
        setError('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    // Listen for new messages
    newSocket.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Load history via socket
    newSocket.on('chat-history', (history) => {
      setMessages(history);
      setLoading(false);
    });

    newSocket.emit('load-history');

    return () => {
      newSocket.close();
    };
  }, [user, chatProjectId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !socket) return;

    try {
      // Send message via HTTP API (which will also save it to DB)
      const response = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          message: newMessage.trim(),
          projectId: chatProjectId
        })
      });

      if (response.ok) {
        // Also emit via socket for real-time broadcasting
        socket.emit('send-message', {
          message: newMessage.trim(),
          userId: user._id || user.id,
          projectId: chatProjectId
        });
        setNewMessage('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={wrapperStyle}>
        <div style={{...pageStyle, justifyContent: 'center', alignItems: 'center'}}>
          <div style={loadingStyle}>Loading chat...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={wrapperStyle}>
        <div style={{...pageStyle, justifyContent: 'center', alignItems: 'center'}}>
          <div style={errorStyle}>
            Please log in to use community chat
            <div style={{ marginTop: '16px' }}>
              <button onClick={() => navigate('/signin')} style={buttonStyle}>
                Go to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={headline}>💬 Community Chat</h1>
            <p style={subhead}>
              {projectId 
                ? `Chat about Project: ${projectId}` 
                : 'Chat with all users in real-time. Share ideas, ask questions, and connect!'}
            </p>
          </div>
          <button onClick={() => navigate('/community')} style={{...buttonStyle, background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)'}}>
            ← Back to Feed
          </button>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
            <button onClick={() => setError(null)} style={{...buttonStyle, marginTop: '8px', padding: '8px 16px', fontSize: '12px'}}>
              Dismiss
            </button>
          </div>
        )}

        <div style={chatContainer}>
          <div style={messagesContainer}>
            {messages.length === 0 ? (
              <div style={loadingStyle}>
                No messages yet. Be the first to say hello! 👋
              </div>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = msg.sender?._id === user._id || msg.sender?.id === user.id;
                return (
                  <div
                    key={msg._id || msg.id}
                    style={isOwnMessage ? ownMessageStyle : otherMessageStyle}
                  >
                    <div style={messageHeader}>
                      <span style={messageAuthor}>
                        {msg.sender?.username || 'Unknown User'}
                      </span>
                      <span style={messageTime}>
                        {formatTime(msg.timestamp || msg.createdAt)}
                      </span>
                    </div>
                    <p style={messageText}>{msg.message}</p>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} style={inputContainer}>
            <input
              type="text"
              placeholder="Type your message..."
              style={inputStyle}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" style={buttonStyle} disabled={!newMessage.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
