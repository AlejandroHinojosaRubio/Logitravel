import React from 'react';
import { ItemListProps } from '../types';

const ItemList: React.FC<ItemListProps> = ({ items, onSelect, onDoubleClick }) => {
  return (
    <div className="item-list">
      {items.map((item) => (
        <div
          key={item.id}
          className={`item ${item.selected ? 'selected' : ''}`}
          onClick={() => onSelect(item.id)}
          onDoubleClick={() => onDoubleClick(item.id)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default ItemList;
