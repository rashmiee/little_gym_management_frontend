// Modal.js

import React from "react";

const Modal = ({ show, onClose, children }) => {
  // If show is false, don't render anything
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          <i className="fa fa-times"></i>
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
