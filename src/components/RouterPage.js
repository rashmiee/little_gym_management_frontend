import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login  from './Login'; // Import Login component

// Import other components
import Registration  from './Registration';
import Dashboard from './users/Dashboard';
import Profile from './users/Profile';
import AdminDashboard from './admin/AdminDashboard';
import AdminProfile from './admin/AdminProfile';

export default function RouterPage() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminprofile" element={<AdminProfile />} />
      </Routes>
    </Router>
  );
}
