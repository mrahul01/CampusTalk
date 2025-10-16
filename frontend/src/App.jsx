import { useState } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Home from './components/home/HomePage';
import Signup from './components/account/Signup';
import Create from './components/post/CreatePost';
import ViewPost from './components/post/ViewPost';
import Login from './components/account/LoginPage';
import Contactus from './components/Contact/Contactus';
import AboutUs from './components/Aboutus/Aboutus';
import AdminDashboard from './components/home/adminPage';
 import ViewBlogs from './components/Profile/ViewBlogs';
import ProfilePage from './components/Profile/ProfilePage';
import EditBlog from './components/Profile/editBlog';
// ✅ Private route for admin 
const PrivateAdminRoute = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return token && isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  const [isAuthenticated, isUserAuthenticated] = useState(false);
  const isAuthenticate = !!sessionStorage.getItem('userId');

  
  return (
    <BrowserRouter>
      <Box style={{ marginTop: 64 }}>
        <Routes>
          <Route path='/' element={<Login isUserAuthenticated={isUserAuthenticated} />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home' element={<Home />} />
          <Route path='/create' element={<Create />} />
          <Route path="/post/:id" element={<ViewPost />} />
          <Route path="/contact" element={<Contactus />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path='/viewblogs' element={<ViewBlogs/>}/>
          <Route path="/editblog/:id" element={<EditBlog />} />
          {/* ✅ Protected Admin Route */}
          <Route element={<PrivateAdminRoute />}>
            <Route path="/adminhome" element={<AdminDashboard />} />
          </Route>

          {/* <Route path="/profile/:username" element={<ProfilePage />} /> */}
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
