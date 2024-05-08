import React, { Fragment, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from "../Dasboards/AdminHeader";
import "../styles/regFormStyle.css";

export default function AllClassSessions() {
  const [classSessions, setClassSessions] = useState([]);
  const [selectedClassSession, setSelectedClassSession] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [children, setChildren] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    // Fetch all class sessions when the component mounts
    fetchClassSessions();
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchChildren(userEmail);
    }
  }, [userEmail]);

  const fetchChildren = (userEmail) => {
    axios
      .get(`/api/Users/children?userEmail=${userEmail}`)
      .then((response) => {
        setChildren(response.data);
      })
      .catch((error) => {
        console.error("Error fetching children:", error);
      });
  };

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

  const openModal = (event, classSession) => {
    event.preventDefault(); // Prevent default form submission behavior
    setSelectedClassSession(classSession);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedClassSession(null);
    setShowModal(false);
  };

  const handleRegistration = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Perform registration logic here
    // For now, let's just close the modal
    closeModal();
  };

  return (
    <Fragment>
      {/* <AdminHeader /> */}

      {/* Display Class */}
      <section>
        <div className="testbox">
          <form>
            <div className="banner">
              <h1>Classes</h1>
            </div>
            <div className="container container-custom">
              {classSessions.map(classSession => (
                <div key={classSession.id} className="card">
                  <Link to={`/class/${classSession.sessionClassId}`} className="card-link">
                    <img src={classSession.image} alt="Class Session" />
                      <div className="card-body">
                        <h5 className="card-title">{classSession.name}</h5>
                        <p className="card-text">{classSession.description}</p>
                        <p className="card-text">Category: {classSession.category}</p>
                        <p className="card-text">Price: ${classSession.price}</p>
                        <p className="card-text">Start Time: {classSession.startTime}</p>
                        <p className="card-text">Start Date: {classSession.startDate}</p>
                        <p className="card-text">End Date: {classSession.endDate}</p>
                      </div>
                    </Link>
                    <div className="card-footer text-center">
                    <button className="btn btn-dark btn-lg btn-block" type="button" onClick={(event) => openModal(event, classSession)}>Register</button>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Modal for registration */}
      {showModal && (
        <div className="modal">
          <div className="modal-content registration-modal-content">
            <span className="close" onClick={closeModal}>
              <i className="fa fa-times"></i>
            </span>
            <h2>{selectedClassSession.name}</h2>
            {/* Dropdown for selecting children */}
            <select className="dropdown-3d">
              <option value="" disabled selected>Select the Child</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>{`${child.firstName} ${child.lastName}`}</option>
              ))}
            </select>
            {/* Add registration form or content here */}
            <div>
              <button className="btn btn-dark btn-lg btn-block registration-modal-button" type="button" onClick={handleRegistration}>Register</button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
