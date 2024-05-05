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

  const handleFeedbackChange = (User_ID, Skill_ID, newFeedback) => {
    axios
      .put(
        `/api/SkillProgress/updateUserSkillFeedback?User_ID=${User_ID}&Skill_ID=${Skill_ID}&feedback=${newFeedback}`
      )
      .then((response) => {
        alert(response.data.statusMessage);
        // Update userSkills state with the new feedback
        setUserSkills((prevUserSkills) => {
          const updatedUserSkills = prevUserSkills.map((skill) => {
            if (skill.User_ID === User_ID && skill.Skill_ID === Skill_ID) {
              return { ...skill, feedback: newFeedback };
            }
            return skill;
          });
          return updatedUserSkills;
        });
      })
      .catch((error) => {
        console.error("Error updating skill feedback:", error);
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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
                        onChange={(e) => setNewSkill_ID(e.target.value)} // Change this line
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
                          <input
                            type="text"
                            value={userSkill.feedback}
                            onChange={(e) =>
                              handleFeedbackChange(
                                userSkill.user_ID,
                                userSkill.skill_ID,
                                e.target.value
                              )
                            }
                          />
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
