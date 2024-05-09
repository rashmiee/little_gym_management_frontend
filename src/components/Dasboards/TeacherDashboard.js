
import TeacherHeader from "./TeacherHeader";
import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import '../styles/AdminDashboard.css';
import { Chart as ChartJS } from 'chart.js/auto'

export default function TeacherDashboard()
{
  const [userData, setUserData] = useState([]);
  const [classSessions, setClassSessions] = useState([]);
  const [skillProgressData, setSkillProgressData] = useState([]);

  useEffect(() => {
    fetchData();
    fetchClassSessions();
    fetchSkillProgress();
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

  const getUserTypeCounts = () => {
    const userTypeCounts = {};
    userData.forEach(user => {
      if (user.type in userTypeCounts) {
        userTypeCounts[user.type]++;
      } else {
        userTypeCounts[user.type] = 1;
      }
    });
    return userTypeCounts;
  };

  const getCategoryCounts = () => {
    const categoryCounts = {};
    classSessions.forEach(session => {
      if (session.category in categoryCounts) {
        categoryCounts[session.category]++;
      } else {
        categoryCounts[session.category] = 1;
      }
    });
    return categoryCounts;
  };

  const getCurrentMonthClasses = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based
    const currentYear = currentDate.getFullYear();

    return classSessions.filter(session => {
      if (!session.endDate) return false; // Skip classes without end date
      const endDate = new Date(session.endDate);
      return endDate.getMonth() + 1 === currentMonth && endDate.getFullYear() === currentYear;
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

  const getFinishedClasses = () => {
    const currentDate = new Date();

    return classSessions.filter(session => {
      const endDate = new Date(session.endDate);
      return endDate < currentDate;
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
          </tr>
        </thead>
        <tbody>
          {classes.map((session, index) => (
            <tr key={index}>
              <td>{session.name}</td>
              <td>{session.category}</td>
              <td>{new Date(session.startDate).toLocaleDateString()}</td>
              <td>{new Date(session.endDate).toLocaleDateString()}</td>
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

    return (
      <div className="chart-container" style={{ padding: '20px' }}>
        <div className="chart-card">
          <h2>User Type Distribution</h2>
          <Bar
            data={{
              labels: Object.keys(userTypeCounts),
              datasets: [{
                label: 'User Count',
                data: Object.values(userTypeCounts),
                backgroundColor: 'rgba(255, 99, 132, 0.4)', // Lighter bar color with transparency
                borderColor: 'rgba(255, 99, 132, 0.6)', // Lighter border color with transparency
                borderWidth: 1
              }]
            }}
            options={{
              plugins: {
                legend: {
                  display: false // Hide legend
                }
              }
            }}
          />
        </div>
        <div className="chart-card">
          <h2>Class Category Distribution</h2>
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
          <div className="classes-table-container">
            {renderClassesTable(getFinishedClasses())}
          </div>
        </div>
        <div className="chart-card">
          <h2>Ongoing Classes</h2>
          <div className="classes-table-container">
            {renderClassesTable(getOngoingClasses())}
          </div>
        </div>
        <div className="chart-card">
          <h2>Skill Progress</h2>
          <Line data={skillProgressChartData} />
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
