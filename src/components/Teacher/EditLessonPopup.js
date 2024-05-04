import React, { useState } from "react";

const EditLessonModal = ({ lesson, onClose, onUpdate }) => {
  const [editedLesson, setEditedLesson] = useState(lesson);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLesson({ ...editedLesson, [name]: value });
  };

  const handleUpdate = () => {
    onUpdate(editedLesson); // Call the onUpdate function passed from the parent
  };

  return (
    <div className="modal">
      <div className="modal-content">
      <span className="close" onClick={onClose}>
        <i className="fa fa-times"></i>
      </span>
        <h2 className="text-center">Edit Lesson</h2>
        <form>
          <label className="bold-label">Name</label>
          <input
            type="text"
            name="name"
            value={editedLesson.name}
            onChange={handleChange}
          />
          <label className="bold-label">Description</label>
          <textarea
            type="text"
            name="description"
            value={editedLesson.description}
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

export default EditLessonModal;
