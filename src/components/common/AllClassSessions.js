import React, { Fragment, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from "../Dasboards/AdminHeader";
import "../styles/regFormStyle.css";

export default function AllClassSessions() {
  const [classSessions, setClassSessions] = useState([]);

  useEffect(() => {
    // Fetch all class sessions when the component mounts
    fetchClassSessions();
  }, []);

  const fetchClassSessions = async () => {
    try {
      const response = await axios.get('/api/ClassSession/getClassSessions');
      setClassSessions(response.data);
    } catch (error) {
      console.error('Error fetching class sessions:', error);
    }
  };
  const categoryOptions = [
    { value: 'parent-child', label: 'Parent-Child' },
    { value: 'pre-k', label: 'Pre-K' },
    { value: 'grade-school', label: 'Grade-School' }
  ];

  return (
    <Fragment>
      {/* <AdminHeader /> */}


      {/* Display Class */}
      <section>
        <div class="testbox">
          <form>
            <div class="banner">
              <h1>Classes</h1>
            </div>
            {/* j------------ */}
            <div class="container container-custom">
              {classSessions.map(classSession => (
                <div key={classSession.id} class="card">
                  <Link to={`/class/${classSession.sessionClassId}`} className="card-link">
                    <img src={classSession.image} alt="Class Session" />
                    <div class="card-body">
                      <h5 class="card-title">{classSession.name}</h5>
                      <p class="card-text">{classSession.description}</p>
                      <p class="card-text">Category: {classSession.category}</p>
                      <p class="card-text">Price: ${classSession.price}</p>
                      <p class="card-text">Start Time: {classSession.startTime}</p>
                      <p class="card-text">Start Date: {classSession.startDate}</p>
                      <p class="card-text">End Date: {classSession.endDate}</p>
                    </div>
                    </Link>
                </div>
              ))}
            </div>
            {/* --------------- */}
          </form>
        </div>
      </section>
    </Fragment>
  );
}
