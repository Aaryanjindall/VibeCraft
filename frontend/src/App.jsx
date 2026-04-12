import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import Landing from './pages/Landing'
import ProtectedRoute from './utils/ProtectedRoute';
import ErrorPage from './pages/ErrorPage';
import Builder from './pages/r';
import CommunityPage from './pages/CommunityPage';
import MyProject from './pages/MyProjects';
import MyCommunity from './pages/MyCommunity';
import CommunityExplore from './pages/CommunityExplore';
import AuthPage from './pages/Auth';
import VibeLayout from './pages/VibeLayout';
function App() {
  return (
    <Router>
  <ToastContainer autoClose={800} />

  <Routes>

    <Route path="/" element={<Landing />} />
    <Route path="/signup" element={<AuthPage />} />
    <Route path="/signin" element={<AuthPage />} />
    <Route path="/ai" element={<VibeLayout />}>
      <Route index element={<Builder />} />
      <Route path="projects" element={<ProtectedRoute><MyProject /></ProtectedRoute>} />
      <Route path="mycommunity" element={<ProtectedRoute><MyCommunity /></ProtectedRoute>} />
      <Route path="community/explore/*" element={<ProtectedRoute><CommunityExplore /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<ErrorPage />} />
  </Routes>
</Router>
        // {/* PROTECTED */}
        // {/* <Route
        //   path="/app"
        //   element={
        //     <ProtectedRoute>
        //        {/* <Vibe /> */}
        //       <Builder/>
        //     // </ProtectedRoute>
        //   }
        // />

        // <Route
        //   path="/projects"
        //   element={
        //     <ProtectedRoute>
        //       <MyProject/>
        //     </ProtectedRoute>
        //   }
        // />
        // <Route
        //   path="/Mycommunity"
        //   element={
        //     <ProtectedRoute>
        //       <MyCommunity/>
        //     </ProtectedRoute>
        //   }
        // />
        // <Route 
        // path="/community/explore/*"
        // element={
        //   <CommunityExplore/>
        // } */}
      //   />
      //   <Route
      //     path="/community"
      //     element={
      //       <ProtectedRoute>
      //         <CommunityPage/>
      //       </ProtectedRoute>
      //     }
      //   />
      //   <Route
      //     path="/community/search"
      //     element={
      //       <ProtectedRoute>
      //         <CommunitySearch />
      //       </ProtectedRoute>
      //     }
      //   />
      //   <Route
      //     path="/community/new"
      //     element={
      //       <ProtectedRoute>
      //         <CreatePost />
      //       </ProtectedRoute>
      //     }
      //   />
      //   <Route
      //     path="/community/chat/:projectId"
      //     element={
      //       <ProtectedRoute>
      //         <CommunityChat />
      //       </ProtectedRoute>
      //     }
      //   />

      //   <Route
      //     path="/mock/:id"
      //     element={
      //       <ProtectedRoute>
      //         <MockPreview />
      //       </ProtectedRoute>
      //     }
      //   />

      //   <Route
      //     path="/admin"
      //     element={
      //       // <ProtectedRoute>
      //         <AdminPortal />
      //       // </ProtectedRoute>
      //     }
      //   />
      //   <Route
      //     path="/dashboard"
      //     element={
      //       <ProtectedRoute>
      //         <Dashboard />
      //       </ProtectedRoute>
      //     }
      //   />
      //   {/* optional public */}
      //   <Route
      //     path="/community/post/:postId"
      //     element={<PostDetail />}
      //   />
      // </Routes>
    
  )
}
export default App