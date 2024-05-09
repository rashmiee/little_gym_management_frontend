import UserHeader from "./UserHeader";
import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import '../styles/AdminDashboard.css';
import { Chart as ChartJS } from 'chart.js/auto'

export default function UserDashboard()
{
  const [userData, setUserData] = useState([]);
  const [classSessions, setClassSessions] = useState([]);
  const [skillProgressData, setSkillProgressData] = useState([]);
  const [childCount, setChildCount] = useState(0);
  const [skillCompletionData, setSkillCompletionData] = useState({});

  useEffect(() => {
    fetchData();
    fetchClassSessions();
    fetchSkillProgress();
    fetchChildCount();
  }, []);

  useEffect(() => {
    // Render the bar chart when skillCompletionData is updated
    if (Object.keys(skillCompletionData).length > 0) {
      renderCharts();
    }
  }, [skillCompletionData]);

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

  const fetchChildCount = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await axios.get(`/api/Users/children?userEmail=${userEmail}`);
      setChildCount(response.data.length);
      // Fetch skill completion data for each child
      const childIds = response.data.map(child => child.id);
      const skillCompletionData = {};
      for (const childId of childIds) {
        const response = await axios.get(`/api/SkillProgress/getAllSkillProgress`);
        skillCompletionData[childId] = response.data;
      }
      setSkillCompletionData(skillCompletionData);
    } catch (error) {
      console.error('Error fetching child count:', error);
    }
  };

  const renderSkillCompletionChart = () => {

    const skillLabels = ['Completed', 'In Progress', 'Not Started']; // Skill status labels
    const childSkillData = Object.keys(skillCompletionData).map(childId => {
      const childProgress = skillCompletionData[childId];
      const progressCounts = [0, 0, 0]; // Initialize counts for each status
      childProgress.forEach(progress => {
        if (progress.status === 'Completed') {
          progressCounts[0]++;
        } else if (progress.status === 'In Progress') {
          progressCounts[1]++;
        } else { // Not Started
          progressCounts[2]++;
        }
      });
      return {
        childId,
        progressCounts
      };
    });
    // Prepare data for the char
    const chartData = {
      labels: skillLabels,
      datasets: childSkillData.map(childData => ({
        label: `Child ${childData.childId}`,
        data: childData.progressCounts,
        backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color for each child
        borderColor: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color for border
        borderWidth: 1
      }))
    };
    // Chart options
    const chartOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          position: 'right',
        },
      },
    };
    // Render the chart
    debugger
    return <Bar data={chartData} options={chartOptions} />;
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

  const getOngoingClasses = () => {
    const currentDate = new Date();

    return classSessions.filter(session => {
      const startDate = new Date(session.startDate);
      const endDate = new Date(session.endDate);
      return startDate <= currentDate && endDate >= currentDate;
    });
  };

  const getNewClasses = () => {
    const currentDate = new Date();

    return classSessions.filter(session => {
      const startDate = new Date(session.startDate);
      return startDate > currentDate;
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
    const categoryCounts = getCategoryCounts();

    return (
      <div className="chart-container" style={{ padding: '20px' }}>
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
          <h2>Ongoing Classes</h2>
          <div className="classes-table-container">
            {renderClassesTable(getOngoingClasses())}
          </div>
        </div>
        <div className="chart-card">
          <h2>New Classes</h2>
          <div className="classes-table-container">
            {renderClassesTable(getNewClasses())}
          </div>
        </div>
        <div className="chart-card">
          <h2>Child Count</h2>
          <div className="card-container">
            <div className="count-card">
              <p>{childCount}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <UserHeader />
      {renderCharts()}
    </Fragment>
  );
}
