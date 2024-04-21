import React, { Fragment, useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";

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

    const handleBeforeUnload = (event) => {
      localStorage.removeItem("userEmail");
      // Optional: Perform additional cleanup or actions here before the user leaves
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Welcome {email}
          </a>
          <button
            data-mdb-collapse-init
            className="navbar-toggler"
            type="button"
            data-mdb-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
              <a className="nav-link" href="#">
                Features
              </a>
              <a className="nav-link" href="#">
                Pricing
              </a>
              <a className="nav-link disabled">Disabled</a>
            </div>
            <button className="btn btn-outline-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </Fragment>
  );
}
