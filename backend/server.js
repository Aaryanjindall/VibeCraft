// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const communityRoutes = require('./routes/communities');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const generateRoutes = require('./routes/generate');
const publishRoutes = require('./routes/publish');
const projectRoutes = require('./routes/project');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aiAuth';

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    apiVersion: '1.0.0',
    endpoints: ['/api/generate', '/api/publish/netlify', '/api/chat']
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/publish', publishRoutes);

// Socket.io setup for real-time chat
const { Server } = require('socket.io');
const ChatMessage = require('./models/Chat');
const Project = require('./models/Project');

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join project-based room
  socket.on('join-project-room', (projectId) => {
    if (projectId) {
      socket.join(`project-${projectId}`);
      console.log(`User ${socket.id} joined project room: ${projectId}`);
    }
  });

  // Leave project room
  socket.on('leave-project-room', (projectId) => {
    if (projectId) {
      socket.leave(`project-${projectId}`);
      console.log(`User ${socket.id} left project room: ${projectId}`);
    }
  });

  // Load chat history for a specific project
  socket.on('load-history', async (data) => {
    try {
      const { projectId } = data || {};
      const query = projectId ? { projectId } : {};
      
      const messages = await ChatMessage.find(query)
        .populate('sender', 'username email')
        .sort({ timestamp: -1 })
        .limit(100)
        .lean();
      
      socket.emit('chat-history', messages.reverse());
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  });

  // Handle new messages
  socket.on('send-message', async (data) => {
    try {
      const { message, userId, projectId } = data;
      
      if (!message || !message.trim() || !userId || !projectId) {
        return;
      }

      const chatMessage = new ChatMessage({
        message: message.trim(),
        sender: userId,
        projectId: projectId
      });

      await chatMessage.save();
      
      const populatedMessage = await ChatMessage.findById(chatMessage._id)
        .populate('sender', 'username email');

      // Broadcast to all users in the specific project room
      io.to(`project-${projectId}`).emit('new-message', populatedMessage);
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error("Server error:", err);
});
