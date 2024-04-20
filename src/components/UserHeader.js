import React, { Fragment, useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";

export default function UserHeader() {
  const navigate = useNavigate();

   const [email, setUserName] = useState("");

   useEffect(() => {
    setUserName(localStorage.getItem("userEmail"));
  }, []);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userEmail");
    navigate("/");
  }

  return (
    <Fragment>
      <nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Welcome {email}</a>
          <button
            data-mdb-collapse-init
            class="navbar-toggler"
            type="button"
            data-mdb-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fas fa-bars"></i>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
              <a class="nav-link" href="#">Features</a>
              <a class="nav-link" href="#">Pricing</a>
              <a class="nav-link disabled"
                >Disabled</a
              >
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  )
}
