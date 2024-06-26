import React, { Fragment, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from "../Dasboards/AdminHeader";
import UserHeader from "../Dasboards/UserHeader";
import TeacherHeader from "../Dasboards/TeacherHeader";
import Swal from 'sweetalert2'

import "../styles/regFormStyle.css";

export default function AllClassSessions() {
  const [classSessions, setClassSessions] = useState([]);
  const [selectedClassSession, setSelectedClassSession] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [children, setChildren] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  const [selectedChildId, setSelectedChildId] = useState(null);

  const [registeredChildren, setRegisteredChildren] = useState([]);
  const [loader, setLoader] = useState(false);

  const [unregisteredChildren, setUnregisteredChildren] = useState([]);
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    // Fetch all class sessions when the component mounts
    fetchClassSessions();
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchChildren(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    if (selectedClassSession) {
      fetchUnregisteredChildren(selectedClassSession.sessionClassId);
    }
  }, [selectedClassSession]);

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
    fetchRegisteredChildren(classSession.sessionClassId); // Fetch registered children for the list
    fetchUnregisteredChildren(classSession.sessionClassId); // Fetch unregistered children for the dropdown
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedChildId(null);
  };

  const handleRegistration = (event) => {
    setLoader(true);
    event.preventDefault(); // Prevent default form submission behavior

    const payload = {
      user_id: selectedChildId,
      class_session_id: selectedClassSession.sessionClassId,
      payment: true, // You can adjust this value as needed
    };

    axios.post('/api/ClassRegistration/addClassRegistration', payload)
      .then(response => {
        Swal.fire({
          title: 'Success!',
          text: "Registration successful!"
        });
        fetchRegisteredChildren(selectedClassSession.sessionClassId); // Fetch registered children for the list
        fetchUnregisteredChildren(selectedClassSession.sessionClassId); // Fetch unregistered children for the dropdown
      })
      .catch(error => {
        console.error('Error registering:', error);
        setLoader(false);
        // Handle error if registration fails
      });
  };

  const fetchRegisteredChildren = (classSessionId) => {
    axios
      .get(`/api/ClassRegistration/getClassRegistrationsByClassSession/${classSessionId}`)
      .then((response) => {
        const registrations = response.data;

        // Map through registrations to find corresponding child information
        const registrationsWithChildInfo = registrations.map(registration => {
          // Find child associated with registration
          const child = children.find(child => child.id === registration.user_id);
          return { ...registration, child }; // Merge registration with child information
        });

        setRegisteredChildren(registrationsWithChildInfo);
      })
      .catch((error) => {
        console.error("Error fetching registered children:", error);
      });
  };


  const handleDeleteRegistration = (registrationId) => {
    axios
      .delete(`/api/ClassRegistration/deleteClassRegistration/${registrationId}`)
      .then((response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Registration deleted successfully'
        });
        fetchRegisteredChildren(selectedClassSession.sessionClassId); // Fetch registered children again after deletion
        fetchUnregisteredChildren(selectedClassSession.sessionClassId); // Update unregistered children in dropdown
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: "Error deleting registration!"
        });
      });
  };

  // Function to fetch unregistered children for the dropdown
  const fetchUnregisteredChildren = (classSessionId) => {
    axios
      .get(`/api/ClassRegistration/getClassRegistrationsByClassSession/${classSessionId}`)
      .then((response) => {
        const registeredChildIds = response.data.map(registration => registration.user_id);
        const unregisteredChildren = children.filter(child => !registeredChildIds.includes(child.id));
        console.log("unregisteredChildren:"+unregisteredChildren);
        setUnregisteredChildren(unregisteredChildren); // Update the dropdown with unregistered children
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching unregistered children for dropdown:", error);
        setLoader(false);
      });
  };

  return (
    <Fragment>
      {/* <AdminHeader /> */}
      {userType === "Admin" && <AdminHeader />}
      {userType === "Users" && <UserHeader />}
      {userType === "Teachers" && <TeacherHeader />}
      {/* Display Class */}
      <section>
        <div className="testbox">
          <form>
            <div className="banner">
              <h1>All Classes</h1>
            </div>
            <div className="container container-custom">
              {classSessions.map(classSession => (
                <div key={classSession.id} className="card card-styled">
                  <Link to={`/class/${classSession.sessionClassId}`} className="card-link">
                    <img src={classSession.image} alt="Class Session" />
                      <div className="card-body">
                        <h5 class="card-title title-styled">{classSession.name}</h5>
                        <p class="card-text description-styled">{classSession.description}</p>
                        <div class="centered-content">
                          <p class="card-text category-styled">Category: {classSession.category}</p>
                          <p class="card-text price-styled">Price: ${classSession.price}</p>
                          <p class="card-text start-time-styled">Start Time: {classSession.startTime}</p>
                          <p class="card-text start-date-styled">Start Date: {classSession.startDate}</p>
                          <p class="card-text end-date-styled">End Date: {classSession.endDate}</p>
                        </div>
                      </div>
                    </Link>
                    {userType === "Users" && (
                      <div className="card-footer text-center">
                        <button className="btn btn-dark btn-lg btn-block" type="button" onClick={(event) => openModal(event, classSession)}>Go to Registration</button>
                      </div>
                    )}
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

            {
              loader ?
              <div>
                <div class="spinner-border text-danger" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              :
              //Dropdown for selecting children
              <select className="dropdown-3d" onChange={(e) => setSelectedChildId(e.target.value)}>
                <option value="" disabled selected>Select the Child</option>
                {unregisteredChildren.map(child => (
                  <option key={child.id} value={child.id}>{`${child.firstName} ${child.lastName}`}</option>
                ))}
              </select>
            }

            {/* Registered children list with delete button */}
            <div className="registered-children-container">
              <h3 className="registered-children-title">Registered Children</h3>
              {registeredChildren.length > 0 ? (
                <div className="registered-children-table">
                  <table className="registered-children-table">
                    <thead>
                      <tr>
                        <th className="registered-children-table-header">First Name</th>
                        <th className="registered-children-table-header">Last Name</th>
                        <th className="registered-children-table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredChildren.map(registration => (
                        <tr key={registration.id} className="registered-children-table-row">
                          <td className="registered-children-table-cell">{registration.child?.firstName}</td>
                          <td className="registered-children-table-cell">{registration.child?.lastName}</td>
                          <td className="registered-children-table-cell">
                            <button className="registered-children-delete-button" onClick={() => handleDeleteRegistration(registration.registration_id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-registered-children-message">No registered children</p>
              )}
            </div>


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
