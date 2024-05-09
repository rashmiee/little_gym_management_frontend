import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ClassSessionDetails.css";
import AdminHeader from "../Dasboards/AdminHeader";

export default function ClassSessionDetails() {
  const { id } = useParams(); // Get id from route parameters
  const [classSession, setClassSession] = useState({});
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    // Fetch class session details when component mounts
    getClassSessionById(id);
    getClassRegistrationsByClassSession(id);
  }, [id]); // Re-run effect when id changes

  const getClassSessionById = async (id) => {
    try {
      const response = await axios.get(
        `/api/ClassSession/getClassSessionById/${id}`
      );
      setClassSession(response.data);
    } catch (error) {
      console.error("Error fetching class session details:", error);
    }
  };

  const getClassRegistrationsByClassSession = async (id) => {
    try {
      const response = await axios.get(
        `/api/ClassRegistration/getClassRegistrationsByClassSession/${id}`
      );
      setRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching class session registrations:", error);
    }
  };

  return (
    <Fragment>
      {/* <AdminHeader /> */}
      <div className="class-session-card">
        <div className="class-session-details">
          <div className="class-session-image">
            <img src={classSession.image} alt="Class Session" />
          </div>
          <div className="class-session-info">
            <h2>{classSession.name}</h2>
            <p>
              <strong>Category:</strong> {classSession.category}
            </p>
            <p>
              <strong>Description:</strong> {classSession.description}
            </p>
            <p>
              <strong>Price:</strong> {classSession.price}
            </p>
            <p>
              <strong>Start Time:</strong> {classSession.startTime}
            </p>
            <p>
              <strong>Start Date:</strong> {classSession.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {classSession.endDate}
            </p>
            {/* Add more details as needed */}
          </div>
        </div>
      </div>
      <section>
        <div class="testbox">
          <form>
            <div class="banner">
              <h1>Class Registrations</h1>
            </div>
            {registrations.length === 0 ? (
              <p>No registrations available</p>
            ) : (
              <table className="table table-striped custome-table-style">
                <thead>
                  <tr>
                    <th scope="col">Registration ID</th>
                    <th scope="col">User ID</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Register Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration.registration_id}>
                      <td>{registration.registration_id}</td>
                      <td>{registration.user_id}</td>
                      <td>{registration.payment ? "Paid" : "Not Paid"}</td>
                      <td>
                        {new Date(
                          registration.register_date
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </form>
        </div>
      </section>
    </Fragment>
  );
}
