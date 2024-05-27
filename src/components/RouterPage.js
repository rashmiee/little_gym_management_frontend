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

export default function RouterPage() {

  // Define a Higher-Order Component (HOC) for role-based access control
  const withRoleAccess = (WrappedComponent, allowedRoles) => {
    const userType = localStorage.getItem('userType');
      console.log("userType:", userType);
      if (userType && allowedRoles.includes(userType)) {
        return <WrappedComponent />;
      } else {
        return <Navigate to="/unauthorized" replace />;
      }
    };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />

        {/* User-specific routes */}

        <Route path="/userDashboard" element={withRoleAccess(UserDashboard, ['Users'])} />
        <Route path="/childRegistration" element={withRoleAccess(ChildRegistration, ['Users'])} />

        {/* Admin-specific routes */}
        <Route path="/adminDashboard" element={withRoleAccess(AdminDashboard, ['Admin'])} />
        <Route path="/teacherRegistration" element={withRoleAccess(TeacherRegistration, ['Admin'])} />
        <Route path="/addClassSession" element={withRoleAccess(AddClassSession, ['Admin'])} />

        {/* Teacher-specific routes */}
        <Route path="/teacherDashboard" element={withRoleAccess(TeacherDashboard, ['Teachers'])} />
        <Route path="/addLessonToClassSession" element={withRoleAccess(AddLessonToClassSession, ['Teachers'])} />
        <Route path="/addLesson" element={withRoleAccess(AddLesson, ['Teachers'])} />
        <Route path="/addSkill" element={withRoleAccess(AddSkill, ['Teachers'])} />
        <Route path="/skillProgress" element={withRoleAccess(SkillProgress, ['Teachers'])} />

        {/* Common routes */}
        <Route path="/class/:id" element={<ClassSessionDetails />} />
        <Route path="/allClassSessions" element={<AllClassSessions />} />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
