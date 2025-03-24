import React from 'react';
import { ActionButtonsProps } from '../types';

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  canDelete, 
  canUndo, 
  onDelete, 
  onUndo, 
  onAdd 
}) => {
  return (
    <div className="buttons">
      <div className="left-buttons">
        <button 
          id="undo"
          disabled={!canUndo}
          className={!canUndo ? 'disabled' : ''}
          onClick={onUndo}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="21" 
            height="19" 
            viewBox="0 0 21 21" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="icon icon-tabler icons-tabler-outline icon-tabler-reload"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
            <path d="M20 4v5h-5" />
          </svg>
        </button>
        <button 
          id="delete"
          disabled={!canDelete}
          className={!canDelete ? 'disabled' : ''}
          onClick={onDelete}
        >
          delete
        </button>
      </div>
      <button 
        id="add"
        className="add-btn"
        onClick={onAdd}
      >
        add
      </button>
    </div>
  );
};

export default ActionButtons;