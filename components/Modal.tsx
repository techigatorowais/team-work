// components/Modal.tsx
import React, { FC, ReactNode } from "react";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  modalTitle: String;
  width?: string;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, modalTitle, width }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className={`bg-white rounded-lg shadow-lg w-full ${width || 'max-w-2xl'}`}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-6 pb-0">
          <h2 className="text-xl font-semibold">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✖
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4">{children}</div>

        
      </div>
    </div>
  );
};

export default Modal;
