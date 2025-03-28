const ADD_ACTION = "add";
const DELETE_ACTION = "delete";

const lastActions = [];

// Wait for the whole DOM to be loaded before adding listeners
document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.querySelector('.item-list');
    const deleteBtn = document.getElementById('delete');
    const undoBtn = document.getElementById('undo');
    const addBtn = document.getElementById('add');
    const popupAddBtn = document.getElementById('popup-add');
    const popupCancelBtn = document.getElementById('popup-cancel');
    const popupInput = document.getElementById('add-item-input');
    const popupBg = document.querySelector('.popup-bg');

    // Add click listeners to the entire item list
    itemList.addEventListener('click', (e) => selectItem(e));
    itemList.addEventListener('dblclick', (e) => deleteItem({event: e}));

    // Buttons listeners
    deleteBtn.addEventListener('click', () => {
        if (deleteBtn.classList.contains('disabled')) return;

        deleteAllSelectedItems();
    });

    undoBtn.addEventListener('click', () => {
        if (undoBtn.classList.contains('disabled')) return;

        if (lastActions.length === 0) return;
        
        // Get the last action performed
        const lastAction = lastActions.pop();
        
        switch(lastAction.action) {
            case ADD_ACTION:
                // We can only add one item per input
                const [addActionItem] = lastAction.items;

                deleteItem({item: addActionItem.item})
                break;
                
            case DELETE_ACTION:
                // If the last action was deleting items, restore them
                restoreItems(lastAction.items);
                break;
        }
        
        // If there are no more actions to undo, disable the undo button
        if (lastActions.length === 0) {
            addDisabledBtnStatus(undoBtn);
        }
    });

    addBtn.addEventListener('click', () => {        
        openPopup();
    });

    popupAddBtn.addEventListener('click', () => {
        handleAddItem();
    });

    popupCancelBtn.addEventListener('click', () => {
        closePopup();
    });

    popupInput.addEventListener('input', () => {
        if(isInputValid()) {
            removeDisabledBtnStatus(popupAddBtn);
        } else {
            addDisabledBtnStatus(popupAddBtn);
        }
    });

    // Keyboard event support for popup
    popupInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (isInputValid()) {
                handleAddItem();
            }
        }
        else if (event.key === 'Escape') {
            closePopup();
        }
    });

    // Aux functions

    const selectItem = (event) => {
        // Get the item clicked 
        const item = event.target.closest('.item');

        if (item) {
            removeDisabledBtnStatus(deleteBtn);

            // Add or remove the selected class
            item.classList.toggle('selected');
        }

        if (document.getElementsByClassName('selected').length === 0) { 
            addDisabledBtnStatus(deleteBtn);
        }
    }

    const deleteAllSelectedItems = () => {
        const selectedItems = itemList.querySelectorAll('.item.selected');
        const allItemsArray = Array.from(itemList.children); 
        const deletedItems = [];
        
        selectedItems.forEach((item) => {
            const index = allItemsArray.indexOf(item);
            
            // Store the item and its current index
            deletedItems.push({
                id: index,
                item: item
            });

            item.classList.remove('selected');
            item.remove();
        });

        if (deletedItems.length > 0) {
            // Save the batch delete action for undo
            lastActions.push({
                action: DELETE_ACTION,
                items: deletedItems
            });
        }

        addDisabledBtnStatus(deleteBtn);
        removeDisabledBtnStatus(undoBtn);
    }

    const deleteItem = ({event, item}) => {
        if (event) {
            // Get the item clicked 
            const eventItem = event.target.closest('.item');
            const index = Array.from(itemList.children).indexOf(eventItem);
            
            // Store the item and its current index
            const deletedItem = {
                id: index,
                item: eventItem
            };
            
            eventItem.remove();

            // Save the single delete action for undo
            lastActions.push({
                action: DELETE_ACTION,
                items: [deletedItem]
            });
            
            removeDisabledBtnStatus(undoBtn);
        } else if (item) {
            // Entering this condition means that the item that we want to remove is from the last add action 
            // We don't want to undo an undo action
            item.remove();
        }
    }

    // Adds items to the list in their original positions
    const restoreItems = (items) => {
        // Sort by ID (original position) to maintain the order
        const sortedItems = [...items].sort((a, b) => a.id - b.id);
                
        sortedItems.forEach(({id, item}) => {
            if (id !== undefined && id < itemList.children.length) {
                // Insert at the specified position
                itemList.insertBefore(item, itemList.children[id]);
            } else {
                // Add to the end if the position is no longer valid
                itemList.appendChild(item);
            }
        });
    }

    const isInputValid = () => (popupInput.value && popupInput.value.trim() !== '');

    const addDisabledBtnStatus = (btn) => {
        btn.setAttribute("disabled", "");
        btn.classList.add("disabled");
    }

    const removeDisabledBtnStatus = (btn) => {
        btn.removeAttribute("disabled");
        btn.classList.remove("disabled");
    }

    const handleAddItem = () => {
        if (popupAddBtn.classList.contains('disabled') || !isInputValid()) return;

        const newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.appendChild(document.createTextNode(popupInput.value.trim()));

        // Add the new item to the list
        itemList.appendChild(newItem);
        
        const index = Array.from(itemList.children).indexOf(newItem);

        // Save the add action for undo
        lastActions.push({
            action: ADD_ACTION, 
            items: [{id: index, item: newItem}]
        });

        addDisabledBtnStatus(popupAddBtn);
        removeDisabledBtnStatus(undoBtn);
        // Reset input and close popup
        popupInput.value = '';
        closePopup();
    }

    const openPopup = () => {
        popupBg.classList.add("open");

        // Auto-focus the input field when popup opens
        popupInput.focus(); 
    }

    const closePopup = () => {
        popupBg.classList.remove("open");
        popupInput.value = ''; 
        addDisabledBtnStatus(popupAddBtn);
    }
});
