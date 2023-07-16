import { create } from 'zustand';

interface AlertState {
  isOpen: boolean;
  dialogTitle?: string;
  dialogDescription?: string;
  onClose: () => void;
  onOpen: (props: {
    dialogTitle?: string;
    dialogDescription?: string;
    onConfirm?: () => void;
  }) => void;
  onConfirm?: () => void;
}

const useAlert = create<AlertState>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false, onConfirm: undefined }),
  onOpen: (props) => set({ isOpen: true, ...props }),
  onConfirm: () => {},
}));

export default useAlert;
