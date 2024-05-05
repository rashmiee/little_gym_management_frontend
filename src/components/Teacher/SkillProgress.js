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
  const [showAddSkillModal, setShowAddSkillModal] = useState(false); // State to control add skill modal visibility
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // State to control feedback modal visibility
  const [feedbackText, setFeedbackText] = useState(""); // State to store feedback text
  const [selectedUserSkill, setSelectedUserSkill] = useState(null); // State to store the selected user skill for feedback
  const [forceUpdate, setForceUpdate] = useState(false); // Dummy state variable for forcing a re-render

  useEffect(() => {
    fetchSkills();
    fetchUserSkills();
    fetchUsers();
  }, [forceUpdate]);

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
        // Toggle the dummy state variable to force a re-render
        setForceUpdate((prev) => !prev);
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

  const openAddSkillModal = () => {
    setShowAddSkillModal(true);
  };

  const closeAddSkillModal = () => {
    setShowAddSkillModal(false);
  };

  const openFeedbackModal = (userSkill) => {
    setSelectedUserSkill(userSkill);
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  const handleFeedbackSubmit = () => {
    if (selectedUserSkill && feedbackText) {
      axios
        .put(
          `/api/SkillProgress/updateUserSkillFeedback?User_ID=${selectedUserSkill.user_ID}&Skill_ID=${selectedUserSkill.skill_ID}&feedback=${feedbackText}`
        )
        .then((response) => {
          alert(response.data.statusMessage);
          // Fetch the updated user skills after submitting the feedback
          fetchUserSkills();
          setFeedbackText(""); // Clear feedback text
          setShowFeedbackModal(false); // Close modal
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
                            onClick={openAddSkillModal}
                          >
                            View Completed Skills
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
              {/* Modals */}
              <Modal show={showAddSkillModal} onClose={closeAddSkillModal}>
                {selectedUser && (
                  <div>
                    <h2>Finished Skills for Child: {selectedUser}</h2>
                    <table className="table table-striped custome-table-style">
                      <thead>
                        <tr>
                          <th scope="col">Skill</th>
                          <th scope="col">Status</th>
                          <th scope="col">Feedback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finishedSkills.map((skill) => (
                          <tr key={skill.Skill_ID}>
                            <td>{skill.skill_ID}</td>
                            <td>{skill.status}</td>
                            <td>{skill.feedback}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Modal>

              <Modal show={showFeedbackModal} onClose={closeFeedbackModal}>
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
              {/* Skill Set */}
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
                            className="select-3d"
                            disabled={userSkill.status === "Completed"} // Disable dropdown if status is "Completed"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <div className="feedback-button-container">
                            {userSkill.feedback ? (
                              <div>{userSkill.feedback}</div>
                            ) : (
                              <button
                                type="button"
                                className="add-feedback-button"
                                onClick={() => openFeedbackModal(userSkill)}
                              >
                                Add Feedback
                              </button>
                            )}
                          </div>
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
