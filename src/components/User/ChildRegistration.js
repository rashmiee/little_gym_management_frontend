import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import UserHeader from "../Dasboards/UserHeader";
import EditChildModal from "./EditChildPopup";

export default function ChildRegistration() {
  const [children, setChildren] = useState([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isFnameValid, setIsFnameValid] = useState(true);
  const [isLnameValid, setIsLnameValid] = useState(true);

  const [selectedChild, setSelectedChild] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (child) => {
    setSelectedChild(child);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = (updatedChild) => {
    axios
      .put(`/api/Users/${updatedChild.id}`, updatedChild)
      .then((result) => {
        alert(result.data.statusMessage);
        closeEditModal();
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          fetchChildren(userEmail);
        }
        fetchChildren(userEmail); // Fetch updated list of Children
      })
      .catch((error) => {
        console.error("Error updating Child:", error);
        alert("Error updating Child. Please try again.");
      });
  };

  const confirmDelete = (child) => {
    console.log(child);
    if (
      window.confirm(
        `Are you sure you want to delete ${child.firstName} ${child.lastName}?`
      )
    ) {
      const url = `/api/Users/${child.id}`;
      console.log(child)
      axios
        .delete(url)
        .then((result) => {
          alert(result.data.statusMessage);
          const userEmail = localStorage.getItem("userEmail");
          if (userEmail) {
            fetchChildren(userEmail);
          }
          fetchChildren(userEmail);
        })
        .catch((error) => {
          console.error("Error deleting child:", error);
          alert("Error deleting child. Please try again.");
        });
    }
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetchChildren(userEmail);
    }
  }, []);

  const fetchChildren = (userEmail) => {
    axios
      .get(`/api/Users/children?userEmail=${userEmail}`)
      .then((response) => {
        setChildren(response.data);
      })
      .catch((error) => {
        console.error("Error fetching children:", error);
      });
  };

  const handleFnameChange = (value) => {
    setFname(value);
    // First name validation
    setIsFnameValid(value.trim() !== "");
  };

  const handleLnameChange = (value) => {
    setLname(value);
    // Last name validation
    setIsLnameValid(value.trim() !== "");
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
    if (
      !isEmailValid ||
      !isPhoneValid ||
      !isPasswordValid ||
      !isFnameValid ||
      !isLnameValid
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("User email is not available. Please log in again.");
      return;
    }
    const data = {
      FirstName: fname,
      LastName: lname,
      Email: email,
      Password: "password",
      PhoneNo: phoneno,
      Type: "Child",
      UserEmail: userEmail,
    };
    const url = "/api/Users/registration";
    axios
      .post(url, data)
      .then((result) => {
        clear();
        const dt = result.data;
        alert(dt.statusMessage);
        fetchChildren(userEmail);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleLogin = () => {
    window.location.url = "/login";
  };

  const validateEmail = (email) => {
    // Email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clear = () => {
    setFname("");
    setLname("");
    setEmail("");
    setPassword("");
    setPhoneno("");
  };

  return (
    <Fragment>
      <UserHeader />
      {/* Registration Form */}
      <section>
        <div className="testbox">
          <form>
            <div className="banner">
              <h1>Child Registration</h1>
            </div>
            <br />
            <fieldset>
              <div className="column-custom">
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
                    {isFnameValid ? (
                      <span className="span-red">*</span>
                    ) : (
                      "(required - Please enter your first name)"
                    )}
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
                    {isLnameValid ? (
                      <span className="span-red">*</span>
                    ) : (
                      "(required - Please enter your last name)"
                    )}
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
                    {isPhoneValid ? (
                      <span className="span-red">*</span>
                    ) : (
                      "(required - Please enter a valid 10-digit phone number)"
                    )}
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
                    {isEmailValid ? (
                      <span className="span-red">*</span>
                    ) : (
                      "(required - Please enter a valid email address)"
                    )}
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
                    className="btn btn-dark btn-lg btn-block"
                    onClick={() => handleSave()}
                  >
                    Submit form
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </section>

      {/* Child Table */}
      <section>
        <div class="testbox">
          <form>
            <div class="banner">
              <h1>Registred Children</h1>
            </div>
            <table className="table table-striped custome-table-style">
              <thead>
                <tr>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {children.map((child, index) => (
                  <tr key={index}>
                    <td>{child.firstName}</td>
                    <td>{child.lastName}</td>
                    <td>{child.email}</td>
                    <td>{child.phoneNo}</td>
                    <td>
                      <button
                        type="button"
                        className="edit-btn-style"
                        onClick={() => openEditModal(child)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        className="delete-btn-style"
                        onClick={() => {
                          confirmDelete(child);
                        }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </div>
        {isModalOpen && (
          <EditChildModal
            child={selectedChild}
            onClose={closeEditModal}
            onUpdate={handleUpdate}
          />
        )}
      </section>
    </Fragment>
  );
}
