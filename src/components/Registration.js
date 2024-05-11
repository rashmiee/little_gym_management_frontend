import React, { useState } from 'react';
import axios from 'axios';
import './styles/registrationStyle.css';
import logo from './images/logo.png';
import Swal from 'sweetalert2'

function Registration() {
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
    console.log("Phone Number:", value); // Check if value is updating correctly
    console.log("IsPhoneValid:", isPhoneValid); // Check if validation state is updating correctly
  };

  const handleSave = () => {
    if (!isEmailValid || !isPhoneValid || !isPasswordValid || !isFnameValid || !isLnameValid) {
      Swal.fire({
        title: 'Error',
        text: "Please fill in all fields correctly."
      });
      return;
    }
    const data = {
      FirstName: fname,
      LastName: lname,
      Email: email,
      Password: password,
      PhoneNo: phoneno,
    };
    const url = '/api/Users/registration';
    axios
      .post(url, data)
      .then((result) => {
        clear();
        const dt = result.data;
        Swal.fire({
          title: 'Success!',
          text: dt.statusMessage
        });
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
    <section className="h-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="card card-registration my-4">
              <div className="row g-0">
                <div className="col-xl-6 d-none d-xl-block">
                  <img
                    src={require('./images/register.jpg')}
                    alt="registration form"
                    className="img-fluid"
                    style={{
                      borderTopLeftRadius: ".25rem",
                      borderBottomLeftRadius: ".25rem",
                    }}
                  />
                </div>
                <div className="col-xl-6">
                  <div className="card-body p-md-5 text-black">
                    <div className="d-flex align-items-center pb-3">
                      <i className="fas fa-user-plus fa-2x me-3" style={{ color: "#ff6219" }}></i>
                      <span className="h1 fw-bold mb-0">Little Gym Management System</span>
                      <img src={logo} alt="Logo" style={{ width: '170px', height: '170px', borderRadius: '50%' }} />
                    </div>

                    <h5 className="fw-normal pb-3 text-center" style={{ letterSpacing: "1px" }}>
                      Fill in the form to register
                    </h5>

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
                        className="form-label d-block custome-label-style"
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
                        className="form-label d-block custome-label-style"
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
                        className="form-label d-block custome-label-style"
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
                        className="form-label d-block custome-label-style"
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
                        className="form-label d-block custome-label-style"
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

                    <div className="d-flex justify-content-left pt-2 custom-reg-form-btn-style">

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
                    <p className="" style={{ color: "#393f81" }}>
                      Already Registered?{" "}
                      <a href="/" style={{ color: "#393f81" }}>
                        Login here
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Registration;
