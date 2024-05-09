import React, { useState } from 'react';
import axios from 'axios';
import logo from './images/logo.png';
import './styles/loginReg.css';
import {useNavigate, Link} from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = (e) => {
    e.preventDefault();
    axios.post('/api/Users/forgotPassword', null, {
      params: {
        email: email,
        newPassword: newPassword
      }
    })
    .then((response) => {
      const dt = response.data;
      alert(dt.statusMessage); // Display an alert with the status message
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <div className="d-flex align-items-center pb-1">
                      <i className="fas fa-cubes fa-2x me-3" style={{ color: "#ff6219" }}></i>
                      <span className="h1 fw-bold mb-0">Little Gym Management System</span>
                      <img src={logo} alt="Logo" style={{ width: '170px', height: '170px', borderRadius: '50%' }} />
                    </div>

                    <h5 className="fw-normal" style={{ letterSpacing: "1px" }}>
                      Forgot Your Password?
                    </h5>

                    <form onSubmit={handleForgotPassword}>
                      <div data-mdb-input-init className="form-outline">
                        <input
                          type="email"
                          id="email"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label className="form-label custome-label-style" htmlFor="email">
                          Enter your email address
                        </label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="password"
                          id="newPassword"
                          className="form-control form-control-lg"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <label className="form-label custome-label-style" htmlFor="newPassword">
                          Enter your new password
                        </label>
                      </div>

                      <div className="pt-2">
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Reset Password
                        </button>
                      </div>
                    </form>

                    {message && <p className="mt-3">{message}</p>}

                    <p className="mt-3" style={{ color: "#393f81" }}>
                      <Link to="/" style={{ color: "#393f81" }}>Back to Login</Link>
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

export default ForgotPassword;
