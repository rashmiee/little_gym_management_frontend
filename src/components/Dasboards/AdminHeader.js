import React, { Fragment, useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
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
  });

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userEmail");
    navigate("/");
  };

   return (
    <Fragment>
      <script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
      <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
      <nav className="top-navbar navbar navbar-expand-lg navbar-light">
        <div className="container">
          <a className="navbar-brand" href="#">
            Welcome {email} {/* Your existing email placeholder */}
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/adminDashboard" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/teacherRegistration" className="nav-link">
                  Teacher Registration
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/addClassSession" className="nav-link">
                  Class Creation
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
