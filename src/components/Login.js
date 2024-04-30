import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import {useNavigate, Link} from "react-router-dom";
import logo from './images/logo.png';
import './styles/loginReg.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const url = '/api/Users/login';
    axios.get(url, {
      params: {
        Email: email,
        Password: password
      }
    })
    .then((response) => {
      const dt = response.data;
      if(dt.statusCode === 200) {
        if(email === "admin@admin.com" && password === "admin") {
          localStorage.setItem("userType", "Admin");
          localStorage.setItem("userEmail", email);
          navigate("/adminDashboard");
        } else {
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userType", dt.userType);
          if(dt.userType === 'Teachers') {
            navigate("/teacherDashboard");
          } else {
            navigate("/userDashboard");
          }
        }
      } else {
        alert(dt.statusMessage);
      }
    })
    .catch((error) => {
      // Displaying status message from the API response instead of generic error
      alert("User is not Valid!");
    });
  };

  return (
    <section className="h-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="card card-registration my-4">
              <div className="row g-0">
                <div className="col-xl-6 d-none d-xl-block">
                  <img
                    src={require('./images/login.jpg')}
                    alt="login form"
                    className="img-fluid"
                    style={{
                      borderTopLeftRadius: ".25rem",
                      borderBottomLeftRadius: ".25rem",
                    }}
                  />
                </div>
                <div className="col-xl-6">
                  <div className="card-body p-md-5 text-black">
                    <div className="d-flex align-items-center pb-5">
                      <i className="fas fa-cubes fa-2x me-3" style={{ color: "#ff6219" }}></i>
                      <span className="h1 fw-bold mb-0">Little Gym Management System</span>
                      <img src={logo} alt="Logo" style={{ width: '170px', height: '170px', borderRadius: '50%' }} />
                    </div>

                    <h5 className="fw-normal pb-3 text-center" style={{ letterSpacing: "1px" }}>
                      Sign into your account
                    </h5>

                    <div data-mdb-input-init className="form-outline">
                      <input
                        type="email"
                        id="form2Example17"
                        className="form-control form-control-lg"
                        onChange={(e) => setEmail(e.target.value)} required
                      />
                      <label className="form-label custome-label-style pb-3" htmlFor="form2Example17">
                        Email address
                      </label>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <input
                        type="password"
                        id="form2Example27"
                        className="form-control form-control-lg"
                        onChange={(e) => setPassword(e.target.value)} required
                      />
                      <label className="form-label custome-label-style" htmlFor="form2Example27">
                        Password
                      </label>
                    </div>

                    <div className="pt-2 mb-4">
                      <button
                        data-mdb-button-init
                        data-mdb-ripple-init
                        className="btn btn-dark btn-lg btn-block"
                        type="button"
                        onClick={(e) => handleLogin(e)}
                      >
                        LOGIN
                      </button>
                    </div>

                    <a className="small text-muted" href="/forgotPassword">
                      Forgot password?
                    </a>
                    <p className="" style={{ color: "#393f81" }}>
                      Don't have an account?{" "}
                      <a href="/registration" style={{ color: "#393f81" }}>
                        Register here
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

export default Login;
