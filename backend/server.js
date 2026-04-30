// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
// Import database connection
const connectDB = require('./config/database');
const User = require("./models/User");
// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');
const generateRoutes = require('./routes/generate');
const projectRoutes = require('./routes/project');
const deployRoutes = require('./routes/deploy');
const communityRoutes = require('./routes/community');
const passport = require("passport");
const initSocket=
require("./sockets/collaborationSocket");
require("./config/passport");
const liveRoomRoutes=
require("./routes/liveRoom");
// Initialize app

const app = express();
app.set('trust proxy', 1); // Trust Render proxy to allow secure cookies

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aiAuth';

// Create HTTP server for Socket.io
const server = http.createServer(app);

// const io = new Server(server,{
//  cors:{
//    origin:true,
//    credentials:true
//  }
// });
// io.use((socket,next)=>{
//  sessionMiddleware(
//    socket.request,
//    {},
//    next
//  );
// });
// initSocket(io);


// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

// app.use(express.json({ limit: '10mb' }));

connectDB();


const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction
  } 
})
app.use(sessionMiddleware);
const io = new Server(server,{
 cors:{
   origin:true,
   credentials:true
 }
});
// io.use((socket,next)=>{
//  sessionMiddleware(
//    socket.request,
//    {},
//    next
//  );
// });

// Session setup
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your_secret_key',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ mongoUrl: MONGO_URI }),
//   cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
// }));
app.use(passport.initialize());
app.use(passport.session());
io.use((socket,next)=>{

 sessionMiddleware(
  socket.request,
  {},
  ()=>{

   passport.initialize()(
    socket.request,
    {},
    ()=>{

      passport.session()(
       socket.request,
       {},
       next
      );

    }
   );

  }
 );

});
initSocket(io);
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

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
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/project', projectRoutes);

app.use('/api/deploy',deployRoutes);
app.use('/api/community/',communityRoutes);
app.use(
"/api/rooms",
liveRoomRoutes
);
// Socket.io setup for real-time chat

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error("Server error:", err);
});
