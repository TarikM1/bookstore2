import React from 'react';
import '../Modal.css';

interface BookDescriptionModalProps {
  description: string;
  title: string;
  onClose: () => void;
  isOpen: boolean;
}

const BookDescriptionModal: React.FC<BookDescriptionModalProps> = ({ description, title, onClose, isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-description1">Description</p>
        <p className="modal-description">{description}</p>
      </div>
    </div>
  );
};

export default BookDescriptionModal;