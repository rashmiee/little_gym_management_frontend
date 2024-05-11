import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import TeacherHeader from "../Dasboards/TeacherHeader";
import EditLessonModal from "./EditLessonPopup";
import Swal from 'sweetalert2'

export default function AddLesson() {
  const [lessons, setLessons] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = (updatedLesson) => {
    axios
      .put(`/api/Lesson/${updatedLesson.lesson_id}`, updatedLesson)
      .then((result) => {
        Swal.fire({
          title: 'Success!',
          text: result.data.statusMessage
        });
        closeEditModal();
        fetchLessons(); // Fetch updated list of Lessons
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: "Error updating Lessons. Please try again."
        });
      });
  };

  const confirmDelete = (lesson) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete ${lesson.name}?`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `/api/Lesson/${lesson.lesson_id}`;
        axios
          .delete(url)
          .then((result) => {
            Swal.fire({
              title: 'Success!',
              text: result.data.statusMessage
            });
            fetchLessons();
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error',
              text: "Error deleting Lesson. This lesson is already added to the class."
            });
          });
      }
    });
  };


  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = () => {
    axios.get("/api/Lesson/getAllLessons")
      .then(response => {
        setLessons(response.data);
      })
      .catch(error => {
        console.error('Error fetching lessons:', error);
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
    const url = '/api/Lesson/addLesson';
    axios
      .post(url, data)
      .then((result) => {
        clear();
        const dt = result.data;
        Swal.fire({
          title: 'Success!',
          text: dt.statusMessage
        });
        fetchLessons();
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
      {/* Lesson Add Form */}
      <section>
      <div class="testbox">
        <form>
          <div className="banner">
            <h1>Lesson Creation</h1>
          </div>
          <br />
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
                  : "(required - Please enter the lesson name)"}
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
                  : "(required - Please enter the lesson description)"}
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

      {/* Lesson Table */}
      <section>
      <div class="testbox">
          <form>
            <div class="banner">
              <h1>Lessons</h1>
            </div>
            <table className="table table-striped custome-table-style">
              <thead>
                <tr>
                  <th scope="col">Lesson Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={index}>
                    <td>{lesson.name}</td>
                    <td>{lesson.description}</td>
                    <td>
                      <button
                        type="button"
                        className="edit-btn-style"
                        onClick={() => openEditModal(lesson)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        className="delete-btn-style"
                        onClick={() => {
                          confirmDelete(lesson);
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
          <EditLessonModal
            lesson={selectedLesson}
            onClose={closeEditModal}
            onUpdate={handleUpdate}
          />
        )}
      </section>
    </Fragment>
  );
}
