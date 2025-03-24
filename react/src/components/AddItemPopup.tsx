import React, { useState, useEffect, useRef } from 'react';
import { AddItemPopupProps } from '../types';

const AddItemPopup: React.FC<AddItemPopupProps> = ({ isOpen, onAdd, onCancel }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Check if input has valid text (not empty or just whitespace)
  const isInputValid = inputValue.trim() !== '';
  
  // Focus input when popup opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setInputValue('');
    }
  }, [isOpen]);
  
  // Handle adding item
  const handleAddItem = () => {
    if (isInputValid) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isInputValid) {
      handleAddItem();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className={`popup-bg ${isOpen ? 'open' : ''}`}>
      <div className="popup">
        <h2>Add item to list</h2>
        <input
          ref={inputRef}
          type="text"
          id="addItemInput"
          placeholder="Type the text here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="popup-buttons">
          <button
            id="popup-add"
            disabled={!isInputValid}
            className={`add-btn ${!isInputValid ? 'disabled' : ''}`}
            onClick={handleAddItem}
          >
            add
          </button>
          <button id="popup-cancel" onClick={onCancel}>
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemPopup;
