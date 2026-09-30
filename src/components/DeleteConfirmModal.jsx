import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, habitTitle }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-icon-wrap">
          <AlertTriangle size={32} className="delete-warning-icon" />
        </div>
        <h3 className="delete-modal-title">Delete Habit</h3>
        <p className="delete-modal-text">
          Are you sure you want to remove <strong>"{habitTitle}"</strong>?
          All associated streak records and check-ins will be permanently deleted.
        </p>
        <div className="modal-actions-row">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger-confirm"
            onClick={onConfirm}
          >
            <Trash2 size={16} />
            <span>Yes, Delete Habit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
