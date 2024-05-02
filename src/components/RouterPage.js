import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import your components
import Login from './Login';
import Registration from './Registration';
import ForgotPassword from './ForgotPassword';
// Dashboards
import UserDashboard from './Dasboards/UserDashboard';
import AdminDashboard from './Dasboards/AdminDashboard';
import TeacherDashboard from './Dasboards/TeacherDashboard';
// Resgistrations
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
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);
  }, []);

  const renderRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/class/:id" element={<ClassSessionDetails />} />
        <Route path="/allClassSessions" element={<AllClassSessions />} />
        {/* Admin routes */}
        {userType === 'Admin' && (
          <>
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/teacherRegistration" element={<TeacherRegistration />} />
            <Route path="/addClassSession" element={<AddClassSession />} />
          </>
        )}
        {/* Teacher routes */}
        {userType === 'Teacher' && (
          <>
            <Route path="/teacherDashboard" element={<TeacherDashboard />} />
            <Route path="/addLessonToClassSession" element={<AddLessonToClassSession />} />
            <Route path="/addLesson" element={<AddLesson />} />
            <Route path="/addSkill" element={<AddSkill />} />
            <Route path="/skillProgress" element={<SkillProgress />} />
          </>
        )}
        {/* User routes */}
        {userType === 'User' && (
          <>
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/childRegistration" element={<ChildRegistration />} />
          </>
        )}
        {/* Redirect to dashboard if unauthorized */}
        {/* <Route path="*" element={<Navigate to={`/${userType.toLowerCase()}Dashboard`} />} /> */}
      </Routes>
    );
  };

  return (
    <Router>
      {renderRoutes()}
    </Router>
  );
}
