import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/headerStyle.css';

export default function UserHeader() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/");
    } else {
      setEmail(userEmail);
    }
  }, []); // Adding an empty dependency array to useEffect to run only once

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userEmail");
    navigate("/");
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
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/teacherDashboard" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/addLesson" className="nav-link">
                  Add Lesson
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/addLessonToClassSession" className="nav-link">
                  Add Lesson To Classes
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/addSkill" className="nav-link">
                  Add Skills
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/skillProgress" className="nav-link">
                  Add Skill Progress
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/allClassSessions" className="nav-link">
                  All Class Sessions
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
