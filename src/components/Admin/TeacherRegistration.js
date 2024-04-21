import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import AdminHeader from "../Dasboards/AdminHeader";

export default function TeacherRegistration()
{
  const [teachers, setTeachers] = useState([]);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isFnameValid, setIsFnameValid] = useState(true);
  const [isLnameValid, setIsLnameValid] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    axios.get('/api/Users/teachers')
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  };

  const handleFnameChange = (value) => {
    setFname(value);
    // First name validation
    setIsFnameValid(value.trim() !== '');
  };

  const handleLnameChange = (value) => {
    setLname(value);
    // Last name validation
    setIsLnameValid(value.trim() !== '');
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
    if (!isEmailValid || !isPhoneValid || !isPasswordValid || !isFnameValid || !isLnameValid) {
      alert('Please fill in all fields correctly.');
      return;
    }
    const data = {
      FirstName: fname,
      LastName: lname,
      Email: email,
      Password: password,
      PhoneNo: phoneno,
      Type: 'Teachers',
    };
    const url = '/api/Users/registration';
    axios
      .post(url, data)
      .then((result) => {
        clear();
        const dt = result.data;
        alert(dt.statusMessage);
        // Fetch updated list of teachers
        fetchTeachers();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleLogin = () => {
    window.location.url = "/login";
  }

  const validateEmail = (email) => {
    // Email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clear = () => {
    setFname('');
    setLname('');
    setEmail('');
    setPassword('');
    setPhoneno('');
  }

  return (
    <Fragment>
      <AdminHeader />
      {/* Registration Form */}
      <section>
        <div className="card card-registration my-4">
        <div className="card-body p-md-5 text-black">
          <h3 className="mb-5 text-uppercase text-center">
            registration form
          </h3>
          <div
            data-mdb-input-init
            className={`form-outline mb-4 ${
              isFnameValid ? "" : "has-invalid"
            }`}
          >
            <input
              type="text"
              id="txtFname"
              className="form-control form-control-lg"
              onChange={(e) => handleFnameChange(e.target.value)}
              value={fname}
            />
            <label
              className="form-label d-block text-center"
              htmlFor="txtFname"
            >
              First name{" "}
              {isFnameValid
                ? "(required)"
                : "(required - Please enter your first name)"}
            </label>
          </div>
          <div
            data-mdb-input-init
            className={`form-outline mb-4 ${
              isLnameValid ? "" : "has-invalid"
            }`}
          >
            <input
              type="text"
              id="txtLname"
              className="form-control form-control-lg"
              onChange={(e) => handleLnameChange(e.target.value)}
              value={lname}
            />
            <label
              className="form-label d-block text-center"
              htmlFor="txtLname"
            >
              Last name{" "}
              {isLnameValid
                ? "(required)"
                : "(required - Please enter your last name)"}
            </label>
          </div>
          <div
            data-mdb-input-init
            className={`form-outline mb-4 ${
              isPhoneValid ? "" : "has-invalid"
            }`}
          >
            <input
              type="text"
              id="txtPhoneno"
              className={`form-control form-control-lg ${
                isPhoneValid ? "" : "is-invalid"
              }`}
              onChange={(e) => handlePhonenoChange(e.target.value)}
              value={phoneno}
            />
            <label
              className="form-label d-block text-center"
              htmlFor="txtPhoneno"
            >
              Phone Number{" "}
              {isPhoneValid
                ? "(required)"
                : "(required - Please enter a valid 10-digit phone number)"}
            </label>
            {!isPhoneValid && (
              <div className="invalid-feedback">
                Please enter a valid 10-digit phone number.
              </div>
            )}
          </div>
          <div
            data-mdb-input-init
            className={`form-outline mb-4 ${
              isPasswordValid ? "" : "has-invalid"
            }`}
          >
            <input
              type="password"
              id="txtPassword"
              className={`form-control form-control-lg ${
                isPasswordValid ? "" : "is-invalid"
              }`}
              onChange={(e) => handlePasswordChange(e.target.value)}
              value={password}
            />
            <label
              className="form-label d-block text-center"
              htmlFor="txtPassword"
            >
              Password{" "}
              {isPasswordValid
                ? "(required)"
                : "(required - Password must be at least 5 characters long)"}
            </label>
            {!isPasswordValid && (
              <div className="invalid-feedback">
                Password must be at least 5 characters long.
              </div>
            )}
          </div>
          <div
            data-mdb-input-init
            className={`form-outline mb-4 ${
              isEmailValid ? "" : "has-invalid"
            }`}
          >
            <input
              type="email"
              id="txtEmail"
              className={`form-control form-control-lg ${
                isEmailValid ? "" : "is-invalid"
              }`}
              onChange={(e) => handleEmailChange(e.target.value)}
              value={email}
            />
            <label
              className="form-label d-block text-center"
              htmlFor="txtEmail"
            >
              Email{" "}
              {isEmailValid
                ? "(required)"
                : "(required - Please enter a valid email address)"}
            </label>
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
              className="btn btn-light btn-lg"
            >
              Reset all
            </button>
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
          <div className="d-flex justify-content-center pt-3">
            <button
              type="button"
              data-mdb-button-init
              data-mdb-ripple-init
              className="btn btn-warning btn-lg ms-2"
              onClick={() => handleLogin()}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      </section>
      {/* Teachers table */}
      <section>
        <div className="card card-registration my-4">
          <div className="card-body p-md-5 text-black">
            <h3 className="mb-5 text-uppercase text-center">Registered Teachers</h3>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher, index) => (
                  <tr key={index}>
                    <td>{teacher.firstName}</td>
                    <td>{teacher.lastName}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phoneNo}</td>
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
