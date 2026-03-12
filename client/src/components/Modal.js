import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-60 backdrop-blur-sm transition-opacity"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-6 pt-5 pb-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl leading-6 font-semibold text-gray-900 tracking-tight">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="bg-gray-50/50 px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
