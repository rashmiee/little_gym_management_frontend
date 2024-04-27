import React, { Fragment, useEffect, useState } from "react";
import axios from 'axios';
import AdminHeader from "../Dasboards/AdminHeader";

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

  const [classSessions, setClassSessions] = useState([]);

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

  const handleSave = () => {
    if (!isNameValid || !isCategoryValid || !isPriceValid || !isStartTimeValid || !isStartDateValid || !isEndDateValid) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const startTime = new Date(); // Example: current time
    const formattedStartTime = formatTime(startTime);

    // Convert image to base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
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
      axios
        .post(url, formData, {
          headers: {
            'Content-Type': 'application/json' // Set content type to JSON
          }
        })
        .then((result) => {
          clear();
          const dt = result.data;
          alert(dt.statusMessage);
        })
        .catch((error) => {
          alert(error.message);
        });
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
        <div className="card card-registration my-4">
          <div className="card-body p-md-5 text-black">
            <h3 className="mb-5 text-uppercase text-center">
              Add Class Session
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
                  : "(required - Please enter the class name)"}
              </label>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="categorySelect">Category</label>
              <select
                className={`form-control form-control-lg ${isCategoryValid ? "" : "is-invalid"}`}
                id="categorySelect"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select Category</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
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
                className="form-label d-block text-center"
                htmlFor="txtDescription"
              >
                Description
              </label>
            </div>

            <div className="mb-4">
              <label htmlFor="imageInput" className="form-label">Select Image</label>
              <input
                type="file"
                className="form-control"
                id="imageInput"
                accept="image/*" // Accept only image files
                onChange={handleImageChange}
              />
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
                className="form-label d-block text-center"
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
                className="form-label d-block text-center"
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
                className="form-label d-block text-center"
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
                className="form-label d-block text-center"
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
                className="btn btn-warning btn-lg ms-2"
                onClick={() => handleSave()}
              >
                Submit form
              </button>
            </div>

            {/* Add reset button to clear form */}
            <div className="d-flex justify-content-center pt-3">
              <button
                type="button"
                data-mdb-button-init
                data-mdb-ripple-init
                className="btn btn-light btn-lg"
                onClick={() => clear()}
              >
                Reset all
              </button>
            </div>

            {/* Optionally, add error feedback for invalid fields */}
            {(!isNameValid || !isCategoryValid || !isPriceValid || !isStartTimeValid || !isStartDateValid || !isEndDateValid) &&
              <div className="alert alert-danger mt-3">
                Please fill in all fields correctly.
              </div>
            }
          </div>
        </div>

        <div className="container">
          <h3 className="mb-4 text-uppercase text-center">Class Sessions</h3>
          <div className="row">
            {classSessions.map(classSession => (
              <div key={classSession.id} className="col-md-4 mb-4">
                <div className="card">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
}
