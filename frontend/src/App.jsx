import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './App.css'

import Vibe from './pages/Vibe'
import Landing from './pages/Landing'

import CommunityFeed from './pages/CommunityFeed'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import CommunityChat from './pages/CommunityChat'
import CommunitySearch from './pages/CommunitySearch'
import MockPreview from './pages/MockPreview'
import AdminPortal from './pages/AdminPortal'

import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './utils/ProtectedRoute';
import ErrorPage from './pages/ErrorPage';
import Builder from './pages/Builder';

// ✅ add


function App() {
  return (
    <Router>

      <ToastContainer autoClose={800}/>

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="*" element={<ErrorPage/>}/>


        {/* PROTECTED */}

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              // {/* <Vibe /> */}
              <Builder/>
            // </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityFeed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/search"
          element={
            <ProtectedRoute>
              <CommunitySearch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/new"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/chat/:projectId"
          element={
            <ProtectedRoute>
              <CommunityChat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mock/:id"
          element={
            <ProtectedRoute>
              <MockPreview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            // <ProtectedRoute>
              <AdminPortal />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* optional public */}
        <Route
          path="/community/post/:postId"
          element={<PostDetail />}
        />

      </Routes>

    </Router>
  )
}

export default App