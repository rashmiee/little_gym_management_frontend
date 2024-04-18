import React, { Fragment, useState } from 'react';
import axios from 'axios'; // Import Axios
import './styles/registrationStyle.css';

function Registration() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneno, setPhoneno] = useState('');

  const handleFnameChange = (value) => {
    setFname(value);
  }
  const handleLnameChange = (value) => {
    setLname(value);
  }
  const handleEmailChange = (value) => {
    setEmail(value);
  }
  const handlePasswordChange = (value) => {
    setPassword(value);
  }
  const handlePhonenoChange = (value) => {
    setPhoneno(value);
  }

  const handleSave = () => {
    const data = {
      FirstName : fname,
      LastName : lname,
      Email : email,
      Password : password,
      PhoneNo : phoneno
    }
    const url = '/api/Users/registration';
    axios.post(url,data).then((result) => {
        alert(result.data)
      }).catch((error) => {
        alert(error);
      })
  }

  return (
    <section class="h-100 bg-dark">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col">
            <div class="card card-registration my-4">
              <div class="row g-0">
                <div class="col-xl-6 d-none d-xl-block">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                  alt="Sample photo"
                  className="img-fluid"
                  style={{ borderTopLeftRadius: '.25rem', borderBottomLeftRadius: '.25rem' }}
                />
                </div>
                <div class="col-xl-6">
                  <div class="card-body p-md-5 text-black">
                    <h3 class="mb-5 text-uppercase">Student registration form</h3>
                    <div data-mdb-input-init class="form-outline mb-4">
                      <input type="text" id="txtFname"  class="form-control form-control-lg" onChange={(e) => handleFnameChange(e.target.value)} />
                      <label class="form-label d-block text-center" for="txtFname">First name</label>
                    </div>
                    <div data-mdb-input-init class="form-outline mb-4">
                      <input type="text" id="txtLname"  class="form-control form-control-lg" onChange={(e) => handleLnameChange(e.target.value)}/>
                      <label class="form-label d-block text-center" for="txtLname">Last name</label>
                    </div>
                    <div data-mdb-input-init class="form-outline mb-4">
                      <input type="text" id="txtPhoneno"  class="form-control form-control-lg" onChange={(e) => handlePhonenoChange(e.target.value)}/>
                      <label class="form-label d-block text-center" for="txtPhoneno">Phone Number</label>
                    </div>
                    <div data-mdb-input-init class="form-outline mb-4">
                      <input type="password" id="form3Example1n1"  class="form-control form-control-lg" onChange={(e) => handlePasswordChange(e.target.value)}/>
                      <label class="form-label d-block text-center" for="form3Example1n1">Password</label>
                    </div>
                    <div data-mdb-input-init class="form-outline mb-4">
                      <input type="email" id="txtEmail" class="form-control form-control-lg" onChange={(e) => handleEmailChange(e.target.value)}/>
                      <label class="form-label d-block text-center" for="txtEmail">Email</label>
                    </div>
                    <div class="d-flex justify-content-center pt-3">
                      <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-light btn-lg">Reset all</button>
                      <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-warning btn-lg ms-2" onClick={() => handleSave()}>Submit form</button>
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
