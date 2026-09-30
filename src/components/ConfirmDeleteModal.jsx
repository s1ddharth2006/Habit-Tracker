import React from 'react';

export default function ConfirmDeleteModal({ isOpen, habitTitle, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-dialog small" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-heading">Delete "{habitTitle}"?</h3>
        <p className="modal-desc">
          This will permanently remove this habit and its recorded logs.
        </p>
        <div className="modal-bottom">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
