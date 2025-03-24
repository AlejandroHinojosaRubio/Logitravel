export interface Item {
  id: string;
  text: string;
  selected: boolean;
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