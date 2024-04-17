import React, { Fragment, useState } from 'react';
import axios from 'axios'; // Import Axios

function Registration() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
  const handleSave = () => {
    const data = {
      FirstName : fname,
      LastName : lname,
      Email : email,
      Password : password
    }
    const url = 'https://localhost:7040/api/Users/registration';
    axios.post(url,data).then((result) => {
        alert(result.data)
      }).catch((error) => {
        alert(error);
      })
  }

  return (
    <Fragment>
      <div>Registration</div>
      <label>First Name</label>
      <input
        type="text"
        id="txtFname"
        placeholder="Enter First name"
        onChange={(e) => handleFnameChange(e.target.value)}
      />
      <br></br>
      <label>Last Name</label>
      <input
        type="text"
        id="txtLname"
        placeholder="Enter Last name"
        onChange={(e) => handleLnameChange(e.target.value)}
      />
      <br></br>
      <label>Email</label>
      <input
        type="text"
        id="txtEmail"
        placeholder="Enter Email"
        onChange={(e) => handleEmailChange(e.target.value)}
      />
      <br></br>
      <label>Password</label>
      <input
        type="password"
        id="txtPassword"
        placeholder="Enter Password"
        onChange={(e) => handlePasswordChange(e.target.value)}
      />
      <br></br>
      <button onClick={() => handleSave()}>Save</button>
    </Fragment>
  );
}

export default Registration;
