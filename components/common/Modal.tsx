
import React, { Fragment } from 'react';
import { XIcon } from '../icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg p-6 mx-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
