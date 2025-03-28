export interface Item {
  id: string;
  text: string;
  selected: boolean;
}

export enum ActionType {
  ADD_ACTION = 'add',
  DELETE_ACTION = 'delete',
}

export interface Action {
  type: ActionType;
  items: Item[];
}

export interface ItemListProps {
  items: Item[];
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

export interface ActionButtonsProps {
  canDelete: boolean;
  canUndo: boolean;
  onDelete: () => void;
  onUndo: () => void;
  onAdd: () => void;
}

export interface AddItemPopupProps {
  isOpen: boolean;
  onAdd: (text: string) => void;
  onCancel: () => void;
}
