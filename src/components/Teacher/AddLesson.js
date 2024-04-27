import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import TeacherHeader from "../Dasboards/TeacherHeader";

export default function AddLesson() {
  const [lessons, setLessons] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);

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
        alert(dt.statusMessage);
        fetchLessons();
      })
      .catch((error) => {
        alert(error);
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
        <div className="card card-registration my-4">
          <div className="card-body p-md-5 text-black">
            <h3 className="mb-5 text-uppercase text-center">
              Lesson Add Form
            </h3>
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
                className="form-label d-block text-center"
                htmlFor="txtName"
              >
                Name{" "}
                {isNameValid
                  ? "(required)"
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
                className="form-label d-block text-center"
                htmlFor="txtDescription"
              >
                Description{" "}
                {isDescriptionValid
                  ? "(required)"
                  : "(required - Please enter the lesson description)"}
              </label>
            </div>
            <div className="d-flex justify-content-center pt-3">
              <button
                type="button"
                data-mdb-button-init
                data-mdb-ripple-init
                className="btn btn-light btn-lg"
                onClick={clear}
              >
                Reset all
              </button>
              <button
                type="button"
                data-mdb-button-init
                data-mdb-ripple-init
                className="btn btn-warning btn-lg ms-2"
                onClick={handleSave}
              >
                Submit form
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Lesson Table */}
      <section>
        <div className="card card-registration my-4">
          <div className="card-body p-md-5 text-black">
            <h3 className="mb-5 text-uppercase text-center">Lessons</h3>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Lesson Name</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={index}>
                    <td>{lesson.name}</td>
                    <td>{lesson.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Fragment>
  );
}
