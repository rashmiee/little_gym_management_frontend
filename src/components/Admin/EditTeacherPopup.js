import React, { useState } from "react";
import axios from "axios";

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
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Teacher</h2>
        <form>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={editedTeacher.firstName}
            onChange={handleChange}
          />
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={editedTeacher.lastName}
            onChange={handleChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={editedTeacher.email}
            onChange={handleChange}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={editedTeacher.password}
            onChange={handleChange}
          />
          <button type="button" onClick={handleUpdate}>Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherModal;
