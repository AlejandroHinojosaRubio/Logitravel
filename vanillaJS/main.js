const lastItemsRemoved = [];

// Wait for the whole DOM to be loaded before adding listeners
document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.querySelector('.item-list');
    const deleteBtn = document.getElementById('delete');
    const undoBtn = document.getElementById('undo');
    const addBtn = document.getElementById('add');
    const popupAddBtn = document.getElementById('popup-add');
    const popupCancelBtn = document.getElementById('popup-cancel');
    const popupInput = document.getElementById('addItemInput');
    const popupBg = document.querySelector('.popup-bg');

    // Add click listeners to the entire item list
    itemList.addEventListener('click', (e) => selectItem(e));
    itemList.addEventListener('dblclick', (e) => deleteItem(e));

    // Buttons listeners
    
    deleteBtn.addEventListener('click', () => {
        if (deleteBtn.classList.contains('disabled')) return;

        deleteAllSelectedItems();
    });

    undoBtn.addEventListener('click', () => {
        if (undoBtn.classList.contains('disabled')) return;

        addItems(lastItemsRemoved);
        
        // Reset removed items array
        lastItemsRemoved.length = 0;

        addDisabledBtnStatus(undoBtn);
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

        selectedItems.forEach(item => {
            item.classList.remove('selected');
            // Save item to allow undo action
            lastItemsRemoved.push(item);
            item.remove();
        });

        addDisabledBtnStatus(deleteBtn);
        removeDisabledBtnStatus(undoBtn);
    }

    const deleteItem = (event) => {
        // Get the item clicked 
        const item = event.target.closest('.item');

        if (item) {
            lastItemsRemoved.push(item);
            item.remove();
        }

        removeDisabledBtnStatus(undoBtn);
    }

    const addItems = (children) => {
        children.forEach(child => {
            // Add items
            itemList.appendChild(child);
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

        addItems([newItem]);

        // Reset input and close popup
        popupInput.value = '';
        addDisabledBtnStatus(popupAddBtn);
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
