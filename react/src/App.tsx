import React, { useCallback, useMemo, useState } from 'react';
import './App.css';
import ActionButtons from './components/ActionButtons';
import AddItemPopup from './components/AddItemPopup';
import ItemList from './components/ItemList';
import { Item } from './types';


const App: React.FC = () => {
  // State declarations
  const [items, setItems] = useState<Item[]>([
    { id: '1', text: 'Item 1', selected: false },
    { id: '2', text: 'Item 2', selected: false },
    { id: '3', text: 'Item 3', selected: false },
    { id: '4', text: 'Item 4', selected: false },
  ]);
  const [removedItems, setRemovedItems] = useState<Item[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // Check if any item is selected
  const hasSelectedItems = useMemo(() => items.some(item => item.selected), [items]);

  // Handler functions
  
  const handleItemSelect = useCallback((id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  }, [items]);

  const handleItemDelete = useCallback((id: string) => {
    const itemToRemove = items.find(item => item.id === id);

    if (itemToRemove) {
      setRemovedItems(prev => [...prev, itemToRemove]);
      setItems(prev => prev.filter(item => item.id !== id));
    }
  }, [items]);

  const handleDeleteSelected = useCallback(() => {
    const selectedItems = items.filter(item => item.selected);

    setRemovedItems([...removedItems, ...selectedItems]);
    setItems(items.filter(item => !item.selected));
  }, [items, removedItems]);

  const handleUndo = useCallback(() => {
    if (removedItems.length > 0) {
      const lastRemovedBatch = [...removedItems];

      setItems(prev => [...prev, ...lastRemovedBatch]);
      setRemovedItems([]);
    }
  }, [removedItems]);

  const handleAddItem = (text: string) => {
    const newItem: Item = {
      id: Date.now().toString(),
      text,
      selected: false
    };

    setItems([...items, newItem]);
    setIsPopupOpen(false);
  };

  return (
    <div className="container">
      <div className="action-panel">
        <div className="text">
          <h1>This is a technical proof</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing, elit mus primis nec inceptos. 
            Lacinia habitasse arcu molestie maecenas cursus quam nunc, hendrerit posuere augue 
            fames dictumst placerat porttitor, dis mi pharetra vestibulum venenatis phasellus.
          </p>
        </div>
        
        <ItemList 
          items={items} 
          onSelect={handleItemSelect} 
          onDoubleClick={handleItemDelete} 
        />
        
        <ActionButtons 
          canDelete={hasSelectedItems}
          canUndo={removedItems.length > 0}
          onDelete={handleDeleteSelected}
          onUndo={handleUndo}
          onAdd={() => setIsPopupOpen(true)}
        />
      </div>

      <AddItemPopup 
        isOpen={isPopupOpen}
        onAdd={handleAddItem}
        onCancel={() => setIsPopupOpen(false)}
      />
    </div>
  );
};

export default App;