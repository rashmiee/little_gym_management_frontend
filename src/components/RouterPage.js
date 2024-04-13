import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './Login';
import Login from './users/DashboardRegistration';
import Login from './users/Dashboard';
import Login from './users/Profile';
import Login from './admin/AdminDashboard';
import Login from './admin/AdminProfile';

export default function RouterPage() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />

        <Route path='/admindashboard' element={<AdminDashboard />} />
        <Route path='/adminprofile' element={<AdminProfile />} />
      </Routes>
    </Router>
  )
}
