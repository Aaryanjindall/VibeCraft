import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import Landing from './pages/Landing'
import ProtectedRoute from './utils/ProtectedRoute';
import ErrorPage from './pages/ErrorPage';
import Builder from './pages/r';
// import CommunityPage from './pages/CommunityPage';
import MyProject from './pages/MyProjects';
import MyCommunity from './pages/MyCommunity';
import CommunityExplore from './pages/CommunityExplore';
import AuthPage from './pages/Auth';
import VibeLayout from './pages/VibeLayout';
import Explore from './pages/Explore';
import { Viewerpage } from './pages/ViewerPage';
import AdminPage from './pages/AdminPortal';
function App() {
  return (
    <Router>
  <ToastContainer 
    position="bottom-right" 
    autoClose={2000} 
    theme="dark" 
    toastClassName="bg-[#1a1a1a] text-[#f0f0f0] border border-[#2d2d2d] shadow-2xl rounded-lg"
  />

  <Routes>

    <Route path="/" element={<Landing />} />
    <Route path="/signup" element={<AuthPage />} />
    <Route path="/signin" element={<AuthPage />} />
    <Route path="/ai" element={<VibeLayout />}>
      <Route index element={<ProtectedRoute><Builder /></ProtectedRoute>} />
      <Route path="projects" element={<ProtectedRoute><MyProject /></ProtectedRoute>} />
      <Route path="mycommunity" element={<ProtectedRoute><MyCommunity /></ProtectedRoute>} />
      <Route path="community/explore/:id" element={<ProtectedRoute><CommunityExplore /></ProtectedRoute>} />
      <Route path="Explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<ErrorPage />} />
    <Route path="/viewer/:id" element={<Viewerpage/>}/>
    <Route path="/admin" element={<AdminPage/>}/>
  </Routes>
</Router>
        
    
  )
}
export default App