import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import TeacherHeader from "../Dasboards/TeacherHeader";
import EditSkillModal from "./EditSkillPopup";
import Swal from 'sweetalert2'

export default function AddSkill() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = (updatedSkill) => {
    console.log(updatedSkill);
    axios
      .put(`/api/Skill/${updatedSkill.skill_ID}`, updatedSkill)
      .then((result) => {
        Swal.fire({
          title: 'Success!',
          text: result.data.statusMessage
        });
        closeEditModal();
        fetchSkills(); // Fetch updated list of Skill
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: "Error updating Skill. Please try again."
        });
      });
  };

  const confirmDelete = (skill) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete ${skill.name}?`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `/api/Skill/${skill.skill_ID}`;
        axios
          .delete(url)
          .then((result) => {
            Swal.fire({
              title: 'Success!',
              text: result.data.statusMessage
            });
            fetchSkills();
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error',
              text: "Error deleting Skill. This Skill is already added to the Progress."
            });
          });
      }
    });
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    axios.get("/api/Skill/getAllSkills")
      .then(response => {
        setSkills(response.data);
      })
      .catch(error => {
        console.error('Error fetching skills:', error);
      });
  };

  const handleNameChange = (value) => {
    setName(value);
    // Name validation
    setIsNameValid(value.trim() !== '');
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    // Description validation
    setIsDescriptionValid(value.trim() !== '');
  };

  const handleSave = () => {
    if (!isNameValid || !isDescriptionValid) {
      alert('Please fill in all fields correctly.');
      return;
    }
    const data = {
      Name: name,
      Description: description
    };
    const url = '/api/Skill/addSkill';
    axios
      .post(url, data)
      .then((result) => {
        clear();
        const dt = result.data;
        Swal.fire({
          title: 'Success!',
          text: dt.statusMessage
        });
        fetchSkills();
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: error
        });

      });
  };

  const clear = () => {
    setName('');
    setDescription('');
  };

  return (
    <Fragment>
      <TeacherHeader />
      {/* Skill Add Form */}
      <section>
        <div className="testbox">
          <form>
            <div className="banner">
              <h1>Skill Creation</h1>
            </div>
            <br/>
            <fieldset>
              <div className="column-custom">
              <div
              data-mdb-input-init
              className={`form-outline mb-4 ${
                isNameValid ? "" : "has-invalid"
              }`}
            >
              <input
                type="text"
                id="txtName"
                className="form-control form-control-lg"
                onChange={(e) => handleNameChange(e.target.value)}
                value={name}
              />
              <label
                className="form-label d-block text-center fw-bolder"
                htmlFor="txtName"
              >
                Name{" "}
                {isNameValid
                  ? <span className="span-red">*</span>
                  : "(required - Please enter the skill name)"}
              </label>
            </div>
            <div
              data-mdb-input-init
              className={`form-outline mb-4 ${
                isDescriptionValid ? "" : "has-invalid"
              }`}
            >
              <textarea
                id="txtDescription"
                className="form-control form-control-lg"
                onChange={(e) => handleDescriptionChange(e.target.value)}
                value={description}
              />
              <label
                className="form-label d-block text-center fw-bolder"
                htmlFor="txtDescription"
              >
                Description{" "}
                {isDescriptionValid
                  ? <span className="span-red">*</span>
                  : "(required - Please enter the skill description)"}
              </label>
            </div>
            <div className="d-flex justify-content-center pt-3">
              <button
                type="button"
                data-mdb-button-init
                data-mdb-ripple-init
                className="btn btn-dark btn-lg btn-block"
                onClick={handleSave}
              >
                Submit form
              </button>
            </div>
              </div>
            </fieldset>
          </form>
        </div>
      </section>

      {/* Skill Table */}
      <section>
        <div className="testbox">
          <form>
            <div class="banner">
              <h1>Skills</h1>
            </div>
            <table className="table table-striped custome-table-style">
              <thead>
                <tr>
                  <th scope="col">Skill Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill, index) => (
                  <tr key={index}>
                    <td>{skill.name}</td>
                    <td>{skill.description}</td>
                    <td>
                      <button
                        type="button"
                        className="edit-btn-style"
                        onClick={() => openEditModal(skill)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        className="delete-btn-style"
                        onClick={() => {
                          confirmDelete(skill);
                        }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </div>
        {isModalOpen && (
          <EditSkillModal
            skill={selectedSkill}
            onClose={closeEditModal}
            onUpdate={handleUpdate}
          />
        )}
      </section>
    </Fragment>
  );
}
