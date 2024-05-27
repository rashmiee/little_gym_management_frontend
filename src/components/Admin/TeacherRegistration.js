import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../Dasboards/AdminHeader";
import EditTeacherModal from "./EditTeacherPopup";
import "../styles/regFormStyle.css";
import '@fortawesome/fontawesome-free/css/all.css';
import Swal from 'sweetalert2'

export default function TeacherRegistration() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isFnameValid, setIsFnameValid] = useState(true);
  const [isLnameValid, setIsLnameValid] = useState(true);

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = (updatedTeacher) => {
    axios
      .put(`/api/Users/${updatedTeacher.id}`, updatedTeacher)
      .then((result) => {
        Swal.fire({
          title: 'Success!',
          text: result.data.statusMessage
        });
        closeEditModal(); // Close the modal after successful update
        fetchTeachers(); // Fetch updated list of teachers
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: "Error updating teacher. Please try again."
        });
      });
  };

  const confirmDelete = (teacher) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `/api/Users/${teacher.id}`;
        axios
          .delete(url)
          .then((result) => {
            Swal.fire({
              title: 'Success!',
              text: result.data.statusMessage
            });
            // Fetch updated list of teachers
            fetchTeachers();
          })
          .catch((error) => {
            console.error("Error deleting teacher:", error);
            Swal.fire({
              title: 'Error',
              text: "Error deleting teacher. Please try again."
            });
          });
      }
    });
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    axios
      .get("/api/Users/teachers")
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  };

  const handleFnameChange = (value) => {
    setFname(value);
    // First name validation
    setIsFnameValid(value.trim() !== "");
  };

  const handleLnameChange = (value) => {
    setLname(value);
    // Last name validation
    setIsLnameValid(value.trim() !== "");
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    // Email validation
    setIsEmailValid(validateEmail(value));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    // Password validation
    setIsPasswordValid(value.length >= 5);
  };

  const handlePhonenoChange = (value) => {
    setPhoneno(value);
    // Phone number validation
    setIsPhoneValid(value.length === 10 && /^\d+$/.test(value));
  };

  const handleSave = () => {
    if (
      !isEmailValid ||
      !isPhoneValid ||
      !isPasswordValid ||
      !isFnameValid ||
      !isLnameValid
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }
    const data = {
      FirstName: fname,
      LastName: lname,
      Email: email,
      Password: password,
      PhoneNo: phoneno,
      Type: "Teachers",
    };
    const url = "/api/Users/registration";
    axios
      .post(url, data)
      .then((result) => {
        clear();
        const dt = result.data;
        if(result.data.statusMessage === "User registration failed. User with this email already exists.") {
          Swal.fire({
            title: 'Error',
            text: "User registration failed. User with this email already exists."
          });
        } else {
          Swal.fire({
            title: 'Success!',
            text: result.data.statusMessage
          });
          fetchTeachers();
        }
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: error
        });
      });
  };

  const handleLogin = () => {
    window.location.url = "/login";
  };

  const validateEmail = (email) => {
    // Email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clear = () => {
    setFname("");
    setLname("");
    setEmail("");
    setPassword("");
    setPhoneno("");
  };

  return (
    <Fragment>
      <AdminHeader />
      {/* Registration Form */}
      <section>
        <div className="testbox">
          <form>
            <div class="banner">
              <h1>Teacher Registration Form</h1>
            </div>
            <br />
            <fieldset>
              <legend>Add Information</legend>
              <div class="column-custom">
                <div
                data-mdb-input-init
                className={`form-outline ${
                  isFnameValid ? "" : "has-invalid"
                }`}
              >
                <label
                  className="form-label d-block text-center fw-bolder"
                  htmlFor="txtFname"
                >
                  First name{" "}
                  {isFnameValid
                    ? <span className="span-red">*</span>
                    : "(required - Please enter your first name)"}
                </label>
                <input
                  type="text"
                  id="txtFname"
                  className="form-control form-control-lg"
                  onChange={(e) => handleFnameChange(e.target.value)}
                  value={fname}
                />
              </div>
              <div
                data-mdb-input-init
                className={`form-outline ${
                  isLnameValid ? "" : "has-invalid"
                }`}
              >
                <label
                  className="form-label d-block text-center fw-bolder"
                  htmlFor="txtLname"
                >
                  Last name{" "}
                  {isLnameValid
                    ? <span className="span-red">*</span>
                    : "(required - Please enter your last name)"}
                </label>
                <input
                  type="text"
                  id="txtLname"
                  className="form-control form-control-lg"
                  onChange={(e) => handleLnameChange(e.target.value)}
                  value={lname}
                />

              </div>
              <div
                data-mdb-input-init
                className={`form-outline ${
                  isPhoneValid ? "" : "has-invalid"
                }`}
              >
                <label
                  className="form-label d-block text-center fw-bolder"
                  htmlFor="txtPhoneno"
                >
                  Phone Number{" "}
                  {isPhoneValid
                    ? <span className="span-red">*</span>
                    : "(required - Please enter a valid 10-digit phone number)"}
                </label>
                <input
                  type="text"
                  id="txtPhoneno"
                  className={`form-control form-control-lg ${
                    isPhoneValid ? "" : "is-invalid"
                  }`}
                  onChange={(e) => handlePhonenoChange(e.target.value)}
                  value={phoneno}
                />

                {!isPhoneValid && (
                  <div className="invalid-feedback">
                    Please enter a valid 10-digit phone number.
                  </div>
                )}
              </div>
              <div
                data-mdb-input-init
                className={`form-outline ${
                  isPasswordValid ? "" : "has-invalid"
                }`}
              >
                <label
                  className="form-label d-block text-center fw-bolder"
                  htmlFor="txtPassword"
                >
                  Password{" "}
                  {isPasswordValid
                    ? <span className="span-red">*</span>
                    : "(required - Password must be at least 5 characters long)"}
                </label>
                <input
                  type="password"
                  id="txtPassword"
                  className={`form-control form-control-lg ${
                    isPasswordValid ? "" : "is-invalid"
                  }`}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  value={password}
                />

                {!isPasswordValid && (
                  <div className="invalid-feedback">
                    Password must be at least 5 characters long.
                  </div>
                )}
              </div>
              <div
                data-mdb-input-init
                className={`form-outline ${
                  isEmailValid ? "" : "has-invalid"
                }`}
              >
                <label
                  className="form-label d-block text-center fw-bolder"
                  htmlFor="txtEmail"
                >
                  Email{" "}
                  {isEmailValid
                    ? <span className="span-red">*</span>
                    : "(required - Please enter a valid email address)"}
                </label>
                <input
                  type="email"
                  id="txtEmail"
                  className={`form-control form-control-lg ${
                    isEmailValid ? "" : "is-invalid"
                  }`}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  value={email}
                />

                {!isEmailValid && (
                  <div className="invalid-feedback">
                    Please enter a valid email address.
                  </div>
                )}
              </div>
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
              </div>
            </fieldset>
          </form>
        </div>
      </section>

      {/* Teachers table */}
      <section>
        <div class="testbox">
          <form>
            <div class="banner">
              <h1>Registred Teachers</h1>
            </div>
            <table className="table table-striped custome-table-style">
              <thead>
                <tr>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
              {teachers.map((teacher, index) => (
                <tr key={index}>
                  <td>{teacher.firstName}</td>
                  <td>{teacher.lastName}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phoneNo}</td>
                  <td>
                    <button type="button" className="edit-btn-style" onClick={() => openEditModal(teacher)}>
                      <i className="fa fa-edit"></i>
                    </button>
                    <button type="button" className="delete-btn-style" onClick={() => {
                      confirmDelete(teacher);
                    }}>
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
          <EditTeacherModal
            teacher={selectedTeacher}
            onClose={closeEditModal}
            onUpdate={handleUpdate}
          />
        )}
      </section>
    </Fragment>
  );
}
