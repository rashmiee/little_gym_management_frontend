import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import AdminHeader from "./AdminHeader";
import { Bar, Pie } from 'react-chartjs-2';
import '../styles/AdminDashboard.css'

export default function AdminDashboard() {
  const [userData, setUserData] = useState([]);
  const [classSessions, setClassSessions] = useState([]);

  useEffect(() => {
    fetchData();
    fetchClassSessions();
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

    const chartData = {
      labels: Object.keys(userTypeCounts),
      datasets: [{
        label: 'User Count',
        data: Object.values(userTypeCounts),
        backgroundColor: 'rgba(255, 99, 132, 0.4)', // Lighter bar color with transparency
        borderColor: 'rgba(255, 99, 132, 0.6)', // Lighter border color with transparency
        borderWidth: 1
      }]
    };

    const categoryChartData = {
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
    };

    return (
      <div className="chart-container">
        <div className="chart-card">
          <h2>User Type Distribution</h2>
          <Bar data={chartData} />
        </div>
        <div className="chart-card">
          <h2>Category Distribution</h2>
          <Pie data={categoryChartData} />
        </div>
        <div className="chart-card">
          <h2>Ongoing Classes</h2>
          <div className="classes-table-container">
            {renderClassesTable(getOngoingClasses())}
          </div>
        </div>
        <div className="chart-card">
          <h2>Finished Classes</h2>
          <div className="classes-table-container">
            {renderClassesTable(getFinishedClasses())}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <AdminHeader />
      <div style={{ padding: '20px' }}>
        {renderCharts()}
      </div>
    </Fragment>
  );
}
