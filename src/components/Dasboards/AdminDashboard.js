import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import AdminHeader from "./AdminHeader";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../styles/AdminDashboard.css'

export default function AdminDashboard() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/Users/getAllUsers');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const chartData = {
    labels: Object.keys(getUserTypeCounts()),
    datasets: [{
      label: 'User Count',
      data: Object.values(getUserTypeCounts()),
      backgroundColor: 'rgba(255, 99, 132, 0.4)', // Lighter bar color with transparency
      borderColor: 'rgba(255, 99, 132, 0.6)', // Lighter border color with transparency
      borderWidth: 1
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false // Hide legend
      }
    },
    scales: {
      x: {
        stacked: true, // Stack bars horizontally
        ticks: {
          color: 'rgba(255, 99, 132, 0.8)' // Lighter color for x-axis ticks
        }
      },
      y: {
        stacked: true, // Stack bars vertically
        ticks: {
          color: 'rgba(255, 99, 132, 0.8)' // Lighter color for y-axis ticks
        }
      }
    },
    elements: {
      bar: {
        backgroundColor: 'rgba(255, 99, 132, 0.4)', // Lighter bar color with transparency
        borderColor: 'rgba(255, 99, 132, 0.6)', // Lighter border color with transparency
        borderWidth: 1
      }
    },
    backgroundColor: 'white' // Set background color to white
  };



  return (
    <Fragment>
      <AdminHeader />
      <div style={{ padding: '20px' }}> {/* Add padding around the cards */}
        <div className="chart-container">
          <div className="chart-card text-center">
            <h2>User Type Distribution</h2>
            {/* Add your first chart here */}
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="chart-card">
          <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="chart-card">
          <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="chart-card">
          <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="chart-card">
          <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="chart-card">
          <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>


    </Fragment>
  );
}
