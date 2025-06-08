import React from "react";

const Modal = ({ isOpen, onClose, children, title, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl p-1 transition-colors"
            aria-label="Fermer"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Sauvegarder
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
