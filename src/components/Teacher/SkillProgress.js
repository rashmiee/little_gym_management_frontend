import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import TeacherHeader from "../Dasboards/TeacherHeader";
import Modal from "./UserSkillProgressModal"; // Import your modal component here

export default function SkillProgress() {
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill_ID, setNewSkill_ID] = useState("");
  const [selectedUser_ID, setSelectedUser_ID] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [finishedSkills, setFinishedSkills] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [feedbackText, setFeedbackText] = useState(""); // State to store feedback text
  const [selectedUserSkill, setSelectedUserSkill] = useState(null); // State to store the selected user skill for feedback

  useEffect(() => {
    fetchSkills();
    fetchUserSkills();
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("/api/Users/getChildren")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const fetchFinishedSkills = (User_ID) => {
    axios
      .get(`/api/SkillProgress/getFinishedSkillsForUser/${User_ID}`)
      .then((response) => {
        setFinishedSkills(response.data);
      })
      .catch((error) => {
        console.error("Error fetching finished skills:", error);
      });
  };

  const handleUserChange = (e) => {
    const User_ID = e.target.value;
    setSelectedUser(User_ID);
    fetchFinishedSkills(User_ID);
  };

  const fetchSkills = () => {
    axios
      .get("/api/Skill/getAllSkills")
      .then((response) => {
        setSkills(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
      });
  };

  const fetchUserSkills = () => {
    axios
      .get("/api/SkillProgress/getAllSkillProgress")
      .then((response) => {
        setUserSkills(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user skills:", error);
      });
  };

  const handleStatusChange = (User_ID, Skill_ID, newStatus) => {
    const requestData = {
      User_ID: User_ID,
      Skill_ID: Skill_ID,
      status: newStatus,
    };

    axios
      .put("/api/SkillProgress/updateSkillProgressStatus", requestData)
      .then((response) => {
        alert(response.data.statusMessage);
        // Update userSkills state with the new status
        setUserSkills((prevUserSkills) => {
          const updatedUserSkills = prevUserSkills.map((skill) => {
            if (skill.User_ID === User_ID && skill.Skill_ID === Skill_ID) {
              return { ...skill, status: newStatus };
            }
            return skill;
          });
          return updatedUserSkills;
        });
      })
      .catch((error) => {
        console.error("Error updating skill status:", error);
      });
  };

  const handleNewSkillSubmit = () => {
    if (selectedUser_ID && newSkill_ID) {
      axios
        .post(
          `/api/SkillProgress/addSkillProgress?User_ID=${selectedUser_ID}&Skill_ID=${newSkill_ID}`
        )
        .then((response) => {
          alert(response.data.statusMessage);
          fetchUserSkills();
          setNewSkill_ID("");
        })
        .catch((error) => {
          console.error("Error adding new skill:", error);
        });
    } else {
      alert("Please select a user and a skill to add.");
    }
  };

  const openModal = (userSkill) => {
    setSelectedUserSkill(userSkill);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFeedbackSubmit = () => {
    if (selectedUserSkill && feedbackText) {
      console.log(selectedUserSkill)
      axios
        .put(
          `/api/SkillProgress/updateUserSkillFeedback?User_ID=${selectedUserSkill.user_ID}&Skill_ID=${selectedUserSkill.skill_ID}&feedback=${feedbackText}`
        )
        .then((response) => {
          alert(response.data.statusMessage);
          // Update userSkills state with the new feedback
          setUserSkills((prevUserSkills) => {
            const updatedUserSkills = prevUserSkills.map((skill) => {
              if (
                skill.User_ID === selectedUserSkill.User_ID &&
                skill.Skill_ID === selectedUserSkill.Skill_ID
              ) {
                return { ...skill, feedback: feedbackText };
              }
              return skill;
            });
            return updatedUserSkills;
          });
          setFeedbackText(""); // Clear feedback text
          setShowModal(false); // Close modal
        })
        .catch((error) => {
          console.error("Error updating skill feedback:", error);
        });
    } else {
      alert("Please enter feedback.");
    }
  };

  return (
    <Fragment>
      <TeacherHeader />
      <section>
        <div className="testbox">
          <form>
            <div className="banner">
              <h1>User Skills Progress</h1>
            </div>
            <div className="column-custom">
              {/* Skill create and Individual users in the same row */}
              <div className="row">
                <div className="col">
                  {/* Skill create */}
                  <section>
                    <div className="form-group">
                      <select
                        className="form-control"
                        id="User_ID"
                        value={selectedUser_ID}
                        onChange={(e) => setSelectedUser_ID(e.target.value)}
                      >
                        <option value="">Select Child</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.firstName}
                          </option>
                        ))}
                        <label htmlFor="User_ID">User</label>
                      </select>
                    </div>
                    <div className="form-group">
                      <select
                        className="form-control"
                        id="Skill_ID"
                        value={newSkill_ID}
                        onChange={(e) => setNewSkill_ID(e.target.value)}
                      >
                        <option value="">Select Skill</option>
                        {skills.map((skill) => (
                          <option key={skill.skill_ID} value={skill.skill_ID}>
                            {skill.skill_ID}
                          </option>
                        ))}
                        <label htmlFor="Skill_ID">New Skill</label>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="btn btn-dark btn-lg btn-block"
                      onClick={handleNewSkillSubmit}
                    >
                      Add New Skill
                    </button>
                  </section>
                </div>
                <div className="col">
                  {/* Individual users */}
                  <section>
                    <div>
                      <div className="row">
                        <div className="col custom-select-container">
                          {/* Select User */}
                          <div className="form-group">
                            <select
                              id="userSelect"
                              value={selectedUser}
                              onChange={handleUserChange}
                              className="custom-select"
                            >
                              <option value="">Select Child</option>
                              {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.id}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* View Skills Button */}
                          <button
                            type="button"
                            className="btn btn-dark btn-lg btn-block btn-inv-user"
                            onClick={openModal}
                          >
                            View Completed Skills
                          </button>
                        </div>
                      </div>

                      <Modal show={showModal} onClose={closeModal}>
                        {selectedUserSkill && (
                          <div>
                            <h2>Feedback for Skill: {selectedUserSkill.skill_ID}</h2>
                            <textarea
                              rows="4"
                              cols="50"
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                            ></textarea>
                            <br />
                            <button
                              type="button"
                              className="btn btn-dark btn-lg"
                              onClick={handleFeedbackSubmit}
                            >
                              Submit Feedback
                            </button>
                          </div>
                        )}
                      </Modal>
                    </div>
                  </section>
                </div>
              </div>
              {/* skill Set*/}
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <table className="table table-striped custome-table-style">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Skill ID</th>
                      <th>Status</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userSkills.map((userSkill, index) => (
                      <tr key={index}>
                        <td>{userSkill.user_ID}</td>
                        <td>{userSkill.skill_ID}</td>
                        <td>
                          <select
                            value={userSkill.status}
                            onChange={(e) =>
                              handleStatusChange(
                                userSkill.user_ID,
                                userSkill.skill_ID,
                                e.target.value
                              )
                            }
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          {userSkill.feedback ? (
                            <div>{userSkill.feedback}</div>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-link"
                              onClick={() => openModal(userSkill)}
                            >
                              Add Feedback
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </form>
        </div>
      </section>
    </Fragment>
  );
}
