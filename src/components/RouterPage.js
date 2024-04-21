import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login  from './Login';
import Registration  from './Registration';
// Dashboards
import UserDashboard from './Dasboards/UserDashboard';
import AdminDashboard from './Dasboards/AdminDashboard';
import TeacherDashboard from './Dasboards/TeacherDashboard';
// Resgistrations
import TeacherRegistration from './Admin/TeacherRegistration';
import ChildRegistration from './User/ChildRegistration';

export default function RouterPage()
{
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        {/* Dashboards */}
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/teacherDashboard" element={<TeacherDashboard />} />
        {/* Resgistrations */}
        <Route path="/teacherRegistration" element={<TeacherRegistration />} />
        <Route path="/childRegistration" element={<ChildRegistration />} />
      </Routes>
    </Router>
  );
}
