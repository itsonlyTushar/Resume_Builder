import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import store from './store/store.js';
import './index.css';
import { AuthProvider } from './auth/AuthContext.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Landing from './pages/Landing.jsx';
import Templates from './components/Templates.jsx';
import Builder from './components/Builder.jsx';
import User from './components/User.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Contact from './pages/Contact.jsx';
import Preview from './components/Preview.jsx';
import NotFound from './pages/404/NotFound.jsx';
import About from './pages/About.jsx';
import { Analytics } from "@vercel/analytics/react"

const ScrollTop = () => {
  const path = useLocation()

  useEffect(()=>{
    window.scrollTo(0,0);
  },[path])
}


const ProtectedRoutesWrapper = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
     
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Landing />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutesWrapper />}>
              <Route path="/select_template" element={<Templates />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/user" element={<User />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        <ScrollTop />
        </Router>
      </AuthProvider>
    </Provider>
    <Analytics />
  </React.StrictMode>
);
