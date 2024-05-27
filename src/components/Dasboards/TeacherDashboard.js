import TeacherHeader from "./TeacherHeader";
import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import '../styles/AdminDashboard.css';
import { Chart as ChartJS } from 'chart.js/auto';

export default function TeacherDashboard() {
  const [userData, setUserData] = useState([]);
  const [classSessions, setClassSessions] = useState([]);
  const [skillProgressData, setSkillProgressData] = useState([]);
  const [skillCount, setSkillCount] = useState(0);
  const [lessonCount, setLessonCount] = useState(0);
  const [classRegistrations, setClassRegistrations] = useState([]);

  useEffect(() => {
    fetchData();
    fetchClassSessions();
    fetchSkillProgress();
    fetchSkillCount();
    fetchLessonCount();
    fetchClassRegistrations();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/Users/getAllUsers');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchClassSessions = async () => {
    try {
      const response = await axios.get('/api/ClassSession/getClassSessions');
      setClassSessions(response.data);
    } catch (error) {
      console.error('Error fetching class sessions:', error);
    }
  };

  const fetchSkillProgress = async () => {
    try {
      const response = await axios.get('/api/SkillProgress/getAllSkillProgress');
      setSkillProgressData(response.data);
    } catch (error) {
      console.error('Error fetching skill progress data:', error);
    }
  };

  const fetchSkillCount = async () => {
    try {
      const response = await axios.get('/api/Skill/getAllSkills');
      setSkillCount(response.data.length);
    } catch (error) {
      console.error('Error fetching skill count:', error);
    }
  };

  const fetchLessonCount = async () => {
    try {
      const response = await axios.get('/api/Lesson/getAllLessons');
      setLessonCount(response.data.length);
    } catch (error) {
      console.error('Error fetching lesson count:', error);
    }
  };

  const fetchClassRegistrations = async () => {
    try {
      const response = await axios.get('/api/ClassRegistration/getAllClassRegistrations');
      setClassRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching class registrations:', error);
    }
  };

  const getClassesWithRegistrations = () => {
    return classSessions.filter(session => {
      return classRegistrations.some(registration => registration.class_session_id === session.sessionClassId);
    });
  };

  const getClassRegistrationCount = (classSessionId) => {
    return classRegistrations.filter(registration => registration.class_session_id === classSessionId).length;
  };

  const getFinishedClasses = () => {
    const currentDate = new Date();

    return classSessions.filter(session => {
      const endDate = new Date(session.endDate);
      return endDate < currentDate;
    });
  };

  const getOngoingClasses = () => {
    const currentDate = new Date();

    return classSessions.filter(session => {
      const startDate = new Date(session.startDate);
      const endDate = new Date(session.endDate);
      return startDate <= currentDate && endDate >= currentDate;
    });
  };

  const renderClassesTable = (classes) => {
    return (
      <table className="classes-table">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Category</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Registrations</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((session, index) => (
            <tr key={index}>
              <td>{session.name}</td>
              <td>{session.category}</td>
              <td>{new Date(session.startDate).toLocaleDateString()}</td>
              <td>{new Date(session.endDate).toLocaleDateString()}</td>
              <td>{getClassRegistrationCount(session.sessionClassId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCharts = () => {
    const userTypeCounts = {};
    userData.forEach(user => {
      if (user.type in userTypeCounts) {
        userTypeCounts[user.type]++;
      } else {
        userTypeCounts[user.type] = 1;
      }
    });

    const categoryCounts = {};
    classSessions.forEach(session => {
      if (session.category in categoryCounts) {
        categoryCounts[session.category]++;
      } else {
        categoryCounts[session.category] = 1;
      }
    });

    const skillProgressLabels = ['Completed', 'InProgress', 'Not Started']; // Change labels here
    const skillProgressDataSets = [];

    // Initialize skill progress datasets for each user
    userData.forEach(user => {
      skillProgressDataSets.push({
        label: user.firstName,
        data: [0, 0, 0], // Initialize with zeros for each status
        borderColor: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color for each user
        fill: false
      });
    });

    // Populate skill progress data
    skillProgressData.forEach(progress => {
      const userIndex = userData.findIndex(user => user.id === progress.user_ID);
      if (userIndex !== -1) {
        if (progress.status === 'Completed') {
          skillProgressDataSets[userIndex].data[0]++;
        } else if (progress.status === 'InProgress') {
          skillProgressDataSets[userIndex].data[1]++;
        } else { // Not Started
          skillProgressDataSets[userIndex].data[2]++;
        }
      }
    });

    const skillProgressChartData = {
      labels: skillProgressLabels,
      datasets: skillProgressDataSets
    };

    const classRegistrationLabels = getClassesWithRegistrations().map(session => session.name);
    const classRegistrationData = getClassesWithRegistrations().map(session => getClassRegistrationCount(session.sessionClassId));

    const classRegistrationChartData = {
      labels: classRegistrationLabels,
      datasets: [
        {
          label: 'Class Registrations',
          data: classRegistrationData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.4)',    // Red
            'rgba(54, 162, 235, 0.4)',    // Blue
            'rgba(255, 206, 86, 0.4)',    // Yellow
            'rgba(75, 192, 192, 0.4)',    // Teal
            'rgba(153, 102, 255, 0.4)',   // Purple
            'rgba(255, 159, 64, 0.4)',    // Orange
            'rgba(51, 204, 51, 0.4)',     // Green
            'rgba(255, 0, 255, 0.4)',     // Magenta
            'rgba(0, 204, 204, 0.4)',     // Cyan
            'rgba(128, 128, 128, 0.4)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 0.4)',    // Red
            'rgba(54, 162, 235, 0.4)',    // Blue
            'rgba(255, 206, 86, 0.4)',    // Yellow
            'rgba(75, 192, 192, 0.4)',    // Teal
            'rgba(153, 102, 255, 0.4)',   // Purple
            'rgba(255, 159, 64, 0.4)',    // Orange
            'rgba(51, 204, 51, 0.4)',     // Green
            'rgba(255, 0, 255, 0.4)',     // Magenta
            'rgba(0, 204, 204, 0.4)',     // Cyan
            'rgba(128, 128, 128, 0.4)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="chart-container" style={{ padding: '20px' }}>
        <div className="chart-card">
          <h2>Class Category Distribution</h2>
          <hr></hr>
          <Pie
            data={{
              labels: Object.keys(categoryCounts),
              datasets: [{
                data: Object.values(categoryCounts),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.4)',
                  'rgba(54, 162, 235, 0.4)',
                  'rgba(255, 206, 86, 0.4)',
                  // Add more colors if you have more categories
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  // Add more colors if you have more categories
                ],
                borderWidth: 1
              }]
            }}
          />
        </div>
        <div className="chart-card">
          <h2>Finished Classes</h2>
          <hr></hr>
          <div className="classes-table-container">
            {renderClassesTable(getFinishedClasses())}
          </div>
        </div>
        <div className="chart-card">
          <h2>Class Registrations</h2>
          <hr></hr>
          <Doughnut data={classRegistrationChartData} />
        </div>
        <div className="chart-card">
          <h2>Ongoing Classes</h2>
          <hr></hr>
          <div className="classes-table-container">
            {renderClassesTable(getOngoingClasses())}
          </div>
        </div>
        <div className="chart-card">
          <h2>Skill Progress</h2>
          <hr></hr>
          <Line data={skillProgressChartData} />
        </div>
        <div className="chart-card">
          <h2>Skill Count</h2>
          <hr></hr>
          <div className="card-container">
            <div className="count-card">
              <p>{skillCount}</p>
            </div>
          </div>
        </div>
        <div className="chart-card">
          <h2>Lesson Count</h2>
          <hr></hr>
          <div className="card-container">
            <div className="count-card">
              <p>{lessonCount}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <TeacherHeader />
      {renderCharts()}
    </Fragment>
  );
}
