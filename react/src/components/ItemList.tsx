import React from 'react';
import { Item } from '../types';

interface ItemListProps {
  items: Item[];
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

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
