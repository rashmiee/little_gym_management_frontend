import React, { useState } from 'react';
import axios from 'axios';
import './styles/registrationStyle.css';

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
    };
    const url = '/api/Users/registration';
    axios
      .post(url, data)
      .then((result) => {
        clear();
        const dt = result.data;
        alert(dt.statusMessage);

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
    <section className="h-100 bg-dark">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="card card-registration my-4">
              <div className="row g-0">
                <div className="col-xl-6 d-none d-xl-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                    alt="Sample photo"
                    className="img-fluid"
                    style={{
                      borderTopLeftRadius: ".25rem",
                      borderBottomLeftRadius: ".25rem",
                    }}
                  />
                </div>
                <div className="col-xl-6">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Registration;
