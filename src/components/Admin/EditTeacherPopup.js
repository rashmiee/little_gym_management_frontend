import React, { useState } from "react";

const EditTeacherModal = ({ teacher, onClose, onUpdate }) => {
  const [editedTeacher, setEditedTeacher] = useState(teacher);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTeacher({ ...editedTeacher, [name]: value });
  };

  const handleUpdate = () => {
    onUpdate(editedTeacher); // Call the onUpdate function passed from the parent
  };

  return (
    <div className="modal">
      <div className="modal-content">
      <span className="close" onClick={onClose}>
        <i className="fa fa-times"></i>
      </span>
        <h2 className="text-center">Edit Teacher</h2>
        <form>
          <label className="bold-label">First Name</label>
          <input
            type="text"
            name="firstName"
            value={editedTeacher.firstName}
            onChange={handleChange}
          />
          <label className="bold-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={editedTeacher.lastName}
            onChange={handleChange}
          />
          <label className="bold-label">Email</label>
          <input
            type="email"
            name="email"
            value={editedTeacher.email}
            onChange={handleChange}
          />
          <label className="bold-label">Phone Number</label>
          <input
            type="text"
            name="PhoneNo"
            value={editedTeacher.phoneNo}
            onChange={handleChange}
          />
          <div className="d-flex justify-content-center pt-3">
          <button type="button" className="btn btn-dark btn-lg btn-block" onClick={handleUpdate}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherModal;
