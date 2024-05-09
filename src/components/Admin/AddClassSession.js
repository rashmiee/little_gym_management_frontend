import React, { Fragment, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from "../Dasboards/AdminHeader";
import "../styles/regFormStyle.css";
import EditClassSessionModal from "./EditClassSessionPopup";

export default function AddClassSession() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState('');
  const [startTime, setStartTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isCategoryValid, setIsCategoryValid] = useState(true);
  const [isPriceValid, setIsPriceValid] = useState(true);
  const [isStartTimeValid, setIsStartTimeValid] = useState(true);
  const [isStartDateValid, setIsStartDateValid] = useState(true);
  const [isEndDateValid, setIsEndDateValid] = useState(true);

  const [selectedClassSession, setSelectedClassSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [classSessions, setClassSessions] = useState([]);

  const openEditModal = (classSession) => {
    setSelectedClassSession(classSession);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

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

  const handleUpdate = (updatedClassSession) => {
    axios
      .put(`/api/ClassSession/${updatedClassSession.sessionClassId}`, updatedClassSession)
      .then((result) => {
        alert(result.data.statusMessage);
        closeEditModal(); // Close the modal after successful update
        fetchClassSessions();
      })
      .catch((error) => {
        console.error("Error updating teacher:", error);
        alert("Error updating teacher. Please try again.");
      });
  };

  const confirmDelete = (classSession) => {
    console.log(classSession);
    if (window.confirm(`Are you sure you want to delete ${classSession.name}?`)) {
      const url = `/api/ClassSession/${classSession.sessionClassId}`;
      axios
        .delete(url)
        .then((result) => {
          alert(result.data.statusMessage);
          // Fetch updated list of teachers
          fetchClassSessions();
        })
        .catch((error) => {
          console.error("Error deleting class:", error);
          alert("Error deleting class. Please try again.");
        });
    }
  };

  const handleNameChange = (value) => {
    setName(value);
    // Name validation
    setIsNameValid(value.trim() !== '');
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    // Category validation
    setIsCategoryValid(value.trim() !== '');
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePriceChange = (value) => {
    setPrice(value);
    // Price validation
    setIsPriceValid(/^\d+(\.\d{1,2})?$/.test(value));
  };

  const handleStartTimeChange = (value) => {
    setStartTime(value);
    // Start time validation
    setIsStartTimeValid(value.trim() !== '');
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    // Start date validation
    setIsStartDateValid(value.trim() !== '');
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    // End date validation
    setIsEndDateValid(value.trim() !== '');
  };

  function formatTime(date) {
    // Extract hours, minutes, and seconds from the Date object
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Construct the formatted time string
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return formattedTime;
  }

  const handleSave = async () => {
    if (!isNameValid || !isCategoryValid || !isPriceValid || !isStartTimeValid || !isStartDateValid || !isEndDateValid) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const startTime = new Date(); // Example: current time
    const formattedStartTime = formatTime(startTime);

    // Convert image to base64 string
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Category', category);
      formData.append('Description', description);
      formData.append('Image', base64Image); // Append the base64 image string to the FormData
      formData.append('Price', parseFloat(price));
      formData.append('StartTime', formattedStartTime);
      formData.append('StartDate', startDate);
      formData.append('EndDate', endDate);

      const url = '/api/ClassSession/addClassSession';
      try {
        const result = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/json' // Set content type to JSON
          }
        });
        const dt = result.data;
        alert(dt.statusMessage);

        // Update class sessions state with the newly added session
        setClassSessions(prevState => [...prevState, {
          id: dt.id, // Assuming dt.id contains the id of the newly added session
          name,
          category,
          description,
          image: base64Image,
          price: parseFloat(price),
          startTime: formattedStartTime,
          startDate,
          endDate
        }]);

        clear();
      } catch (error) {
        alert(error.message);
      }
    };

    // Read the image file as base64
    reader.readAsDataURL(image);
  };

  const clear = () => {
    setName('');
    setCategory('');
    setDescription('');
    setImage('');
    setPrice('');
    setStartTime('');
    setStartDate('');
    setEndDate('');
  }

  const categoryOptions = [
    { value: 'parent-child', label: 'Parent-Child' },
    { value: 'pre-k', label: 'Pre-K' },
    { value: 'grade-school', label: 'Grade-School' }
  ];

  return (
    <Fragment>
      <AdminHeader />
      {/* Add Class Form */}
      <section>
        <div className="testbox">
          <form>
            <div className="banner">
              <h1>Class Session Form</h1>
            </div>
            <br />
            <fieldset>
              <legend>Add Class Information</legend>
              <div class="column-custom">
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
                  className="form-label d-block text-center fw-bolder fw-bolder"
                  htmlFor="txtName"
                >
                  Name{" "}
                  {isNameValid
                    ? <span className="span-red">*</span>
                    : "(required - Please enter the class name)"}
                </label>
              </div>
              <div className="form-group mb-4">
                <select
                  className={`form-control form-control-lg ${isCategoryValid ? "" : "is-invalid"}`}
                  id="categorySelect"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value=""></option>
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <label htmlFor="categorySelect" className="fw-bolder">Category</label>
                {!isCategoryValid && <div className="invalid-feedback">Please select a category.</div>}
              </div>
              {/* Other input fields for Description, Image, Price, StartTime, StartDate, EndDate */}
              <div
                data-mdb-input-init
                className={`form-outline mb-4`}
              >
                <textarea
                  id="txtDescription"
                  className="form-control form-control-lg"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
                <label
                  className="form-label d-block text-center fw-bolder fw-bolder"
                  htmlFor="txtDescription"
                >
                  Description
                </label>
              </div>

              <div className="mb-4">
                <input
                  type="file"
                  className="form-control"
                  id="imageInput"
                  accept="image/*" // Accept only image files
                  onChange={handleImageChange}
                />
                <label htmlFor="imageInput" className="form-label fw-bolder fw-bolder">Select Image</label>
              </div>
              <div
                data-mdb-input-init
                className={`form-outline mb-4`}
              >
                <input
                  type="number"
                  id="txtPrice"
                  className={`form-control form-control-lg`}
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
                <label
                  className="form-label d-block text-center fw-bolder"
                  htmlFor="txtPrice"
                >
                  Price
                </label>
              </div>

              <div
                data-mdb-input-init
                className={`form-outline mb-4`}
              >
                <input
                  type="time"
                  id="txtStartTime"
                  className={`form-control form-control-lg`}
                  onChange={(e) => setStartTime(e.target.value)}
                  value={startTime}
                />
                <label
                  className="form-label d-block text-center fw-bolder"
                  htmlFor="txtStartTime"
                >
                  Start Time
                </label>
              </div>

              <div
                data-mdb-input-init
                className={`form-outline mb-4`}
              >
                <input
                  type="date"
                  id="txtStartDate"
                  className={`form-control form-control-lg`}
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                />
                <label
                  className="form-label d-block text-center fw-bolder"
                  htmlFor="txtStartDate"
                >
                  Start Date
                </label>
              </div>

              <div
                data-mdb-input-init
                className={`form-outline mb-4`}
              >
                <input
                  type="date"
                  id="txtEndDate"
                  className={`form-control form-control-lg`}
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                />
                <label
                  className="form-label d-block text-center fw-bolder"
                  htmlFor="txtEndDate"
                >
                  End Date
                </label>
              </div>

              {/* Add submit button to trigger handleSave function */}
              <div className="d-flex justify-content-center pt-3">
                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-dark btn-lg btn-block"
                  onClick={() => handleSave()}
                >
                  Submit form
                </button>
              </div>
              {/* Optionally, add error feedback for invalid fields */}
              {(!isNameValid || !isCategoryValid || !isPriceValid || !isStartTimeValid || !isStartDateValid || !isEndDateValid) &&
                <div className="alert alert-danger mt-3">
                  Please fill in all fields correctly.
                </div>
              }
              </div>
            </fieldset>
          </form>
        </div>
      </section>

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
                    <img src={classSession.image} alt="Class Session" />
                    <div class="card-body">
                    <Link to={`/class/${classSession.sessionClassId}`} className="card-link">
                      <h5 class="card-title">{classSession.name}</h5>
                      <p class="card-text">{classSession.description}</p>
                      <p class="card-text">Category: {classSession.category}</p>
                      <p class="card-text">Price: ${classSession.price}</p>
                      <p class="card-text">Start Time: {classSession.startTime}</p>
                      <p class="card-text">Start Date: {classSession.startDate}</p>
                      <p class="card-text">End Date: {classSession.endDate}</p>
                      </Link>
                      <p class="card-footer text-center">
                        <button type="button" className="edit-btn-style" onClick={() => openEditModal(classSession)}>
                          <i className="fa fa-edit"></i>
                        </button>
                        <button type="button" className="delete-btn-style" onClick={() => {
                          confirmDelete(classSession);
                        }}>
                          <i className="fa fa-trash"></i>
                        </button>
                    </p>
                    </div>
                </div>
              ))}
            </div>
            {/* --------------- */}
          </form>
        </div>
        {isModalOpen && (
          <EditClassSessionModal
            classSession={selectedClassSession}
            onClose={closeEditModal}
            onUpdate={handleUpdate}
          />
        )}
      </section>
    </Fragment>
  );
}
