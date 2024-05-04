import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import your components
import Login from './Login';
import Registration from './Registration';
import ForgotPassword from './ForgotPassword';
import UnauthorizedPage from './UnauthorizedPage'; // Import the UnauthorizedPage component

// Dashboards
import UserDashboard from './Dasboards/UserDashboard';
import AdminDashboard from './Dasboards/AdminDashboard';
import TeacherDashboard from './Dasboards/TeacherDashboard';

// Registrations
import TeacherRegistration from './Admin/TeacherRegistration';
import ChildRegistration from './User/ChildRegistration';

// ClassSession
import AddClassSession from './Admin/AddClassSession';
import AddLessonToClassSession from './Teacher/AddLessonToClassSession';
import ClassSessionDetails from './common/ClassSessionDetails';
import AllClassSessions from './common/AllClassSessions';

// Lesson
import AddLesson from './Teacher/AddLesson';

// Skill
import AddSkill from './Teacher/AddSkill';

// SkillProgress
import SkillProgress from './Teacher/SkillProgress';

// Define a Higher-Order Component (HOC) for role-based access control
const withRoleAccess = (WrappedComponent, allowedRoles) => {
  const userRole = localStorage.getItem("userType");
  if (userRole && allowedRoles.includes(userRole)) {
    return <WrappedComponent />;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};


export default function RouterPage() {
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* User-specific routes */}

        <Route path="/userDashboard" element={<UserDashboard/>} />
        <Route path="/childRegistration" element={<withRoleAccess/>} />

        {/* Admin-specific routes */}
        <Route path="/adminDashboard" element={<AdminDashboard/>} />
        <Route path="/teacherRegistration" element={<TeacherRegistration/>} />
        <Route path="/addClassSession" element={<AddClassSession/>} />

        {/* Teacher-specific routes */}
        <Route path="/teacherDashboard" element={<TeacherDashboard/>} />
        <Route path="/addLessonToClassSession" element={<AddLessonToClassSession/>} />
        <Route path="/addLesson" element={<AddLesson/>} />
        <Route path="/addSkill" element={<AddSkill/>} />
        <Route path="/skillProgress" element={<SkillProgress/>} />

        {/* Common routes */}
        <Route path="/class/:id" element={<ClassSessionDetails />} />
        <Route path="/allClassSessions" element={<AllClassSessions />} />
      </Routes>
    </Router>
  );
}
