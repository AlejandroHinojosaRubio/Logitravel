import { FC, useCallback, useMemo, useState } from 'react';
import './App.css';
import ActionButtons from './components/ActionButtons';
import AddItemPopup from './components/AddItemPopup';
import ItemList from './components/ItemList';
import { Item, Action, ActionType } from './types';

const App: FC = () => {
  // State declarations
  const [items, setItems] = useState<Item[]>([
    { id: '1', text: 'Item 1', selected: false },
    { id: '2', text: 'Item 2', selected: false },
    { id: '3', text: 'Item 3', selected: false },
    { id: '4', text: 'Item 4', selected: false },
  ]);
  const [actionHistory, setActionHistory] = useState<Action[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // Check if any item is selected
  const hasSelectedItems = useMemo(() => items.some(item => item.selected), [items]);
  
  // Check if we have actions to undo
  const canUndo = useMemo(() => actionHistory.length > 0, [actionHistory]);

  // Handler functions

  const handleItemSelect = useCallback((id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  }, [items]);

  const handleItemDelete = useCallback((id: string) => {
    const itemToRemove = items.find(item => item.id === id);

    if (itemToRemove) {
      // Record the delete action
      const deleteAction: Action = {
        type: ActionType.DELETE_ACTION,
        items: [{ ...itemToRemove }]
      };

      setActionHistory(prev => [...prev, deleteAction]);
      setItems(items.filter(item => item.id !== id));
    }
  }, [items]);

  const handleDeleteSelected = useCallback(() => {
    const selectedItems = items.filter(item => item.selected);
    
    if (selectedItems.length > 0) {
      const deleteAction: Action = {
        type: ActionType.DELETE_ACTION,
        // Record the batch delete action with unselected copies to prevent selected style when doing the undo
        items: selectedItems.map(item => ({ ...item, selected: false }))
      };

      setActionHistory(prev => [...prev, deleteAction]);
      setItems(items.filter(item => !item.selected));
    }
  }, [items]);

  const handleUndo = useCallback(() => {
    if (actionHistory.length === 0) return;
    const lastAction = actionHistory[actionHistory.length - 1]

    switch (lastAction?.type) {
      case ActionType.ADD_ACTION:
        // For add actions, simply remove the added items by their id
        setItems(prevItems => 
          prevItems.filter(item => 
            !lastAction.items.some(actionItem => actionItem.id === item.id)
          )
        );
        break;

      case ActionType.DELETE_ACTION:
        // For delete actions, restore the items (ordered by id to maintain the original positions)
        setItems(prevItems => [
          ...prevItems,
          ...lastAction.items
        ].sort((a, b) => Number(a.id) - Number(b.id)));
        break;
    }

    // Remove the action from history
    setActionHistory(prev => prev.slice(0, prev.length - 1));
  }, [actionHistory]);

  const handleAddItem = useCallback((text: string) => {
    const newItem: Item = {
      id: Date.now().toString(),
      text,
      selected: false
    };
    setItems(prev => [...prev, newItem]);
    
    const addAction: Action = {
      type: ActionType.ADD_ACTION,
      items: [newItem]
    };

    setActionHistory(prev => [...prev, addAction]);
    setIsPopupOpen(false);
  }, []);

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
          canUndo={canUndo}
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
