import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/headerStyle.css';

export default function UserHeader() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      window.location.href = "/";
    } else {
      setEmail(userEmail);
    }
  }, []); // Adding an empty dependency array to useEffect to run only once

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Fragment>
      <nav className="top-navbar navbar navbar-expand-lg navbar-light">
        <div className="container">
          <a className="navbar-brand" href="#">
            Welcome
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to="/userDashboard" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/childRegistration" className="nav-link">
                  Child Registration
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/allClassSessions" className="nav-link">
                  All Classes
                </Link>
              </li>
            </ul>
          </div>
          <button className="et-button medium stylish-button" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
    </Fragment>
  );
}
