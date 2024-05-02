import React, { useState } from "react";

const EditClassSessionModal = ({ classSession, onClose, onUpdate }) => {
  const [editedclassSession, setEditedTeacher] = useState(classSession);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // If the input type is file, update the image with the selected file
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setEditedTeacher({ ...editedclassSession, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    } else {
      // If the input type is not file, update the image with the value directly
      setEditedTeacher({ ...editedclassSession, [name]: value });
    }
  };

  const handleUpdate = () => {
    onUpdate(editedclassSession); // Call the onUpdate function passed from the parent
  };

  const categoryOptions = [
    { value: 'parent-child', label: 'Parent-Child' },
    { value: 'pre-k', label: 'Pre-K' },
    { value: 'grade-school', label: 'Grade-School' }
  ];

  return (
    <div className="modal">
      <div className="modal-content">
      <span className="close" onClick={onClose}>
        <i className="fa fa-times"></i>
      </span>
        <h2 className="text-center">Edit classSession</h2>
        <form>
          <label className="bold-label">First Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
            value={editedclassSession.name}
            onChange={handleChange}
          />
          <label className="bold-label">Category</label>
          <br />
          <select
            className="form-control"
            name="category"
            value={editedclassSession.category}
            onChange={handleChange}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <label className="bold-label">Description</label>
          <textarea
            className="form-control"
            type="text"
            name="description"
            value={editedclassSession.description}
            onChange={handleChange}
          />
          <label className="bold-label">Image</label>
          <div className="form-group">
            <input
              type="file"
              className="form-control"
              name="image"
              accept="image/*" // Accept only image files
              onChange={handleChange}
            />
            {editedclassSession.image ? (
              <span>Image attached.</span>
            ) : (
              <span>No file selected</span>
            )}
          </div>
          <label className="bold-label">Price </label>
          <input
            className="form-control"
            type="number"
            name="price"
            onChange={handleChange}
            value={editedclassSession.price}
          />
          <label className="bold-label">Start Time </label>
          <input
            type="time"
            name="startTime"
            className="form-control"
            onChange={handleChange}
            value={editedclassSession.startTime}
          />
          <label className="bold-label">Start Date </label>
          <input
            type="date"
            name="startDate"
            className="form-control"
            onChange={handleChange}
            value={editedclassSession.startDate ? new Date(editedclassSession.startDate).toISOString().split('T')[0] : ''}
          />
          <label className="bold-label">End Date </label>
          <input
            type="date"
            name="endDate"
            className="form-control"
            onChange={handleChange}
            value={editedclassSession.endDate ? new Date(editedclassSession.endDate).toISOString().split('T')[0] : ''}
          />
          <div className="d-flex justify-content-center pt-3">
          <button type="button" className="btn btn-dark btn-lg btn-block" onClick={handleUpdate}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClassSessionModal;
