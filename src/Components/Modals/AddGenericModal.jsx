import React from "react";

const AddGenericModal = ({ show, isOpen, onClose, title, children, size = "md" }) => {
  const visible = show ?? isOpen;
  if (!show) return null;
  if (!visible) return null;

  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  return (
    // backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      {/* panel */}
      <div className={`bg-gradient-to-r from-teal-900 to-teal-600 p-1 rounded-xl w-full ${sizeClass} mx-4 my-8`}>
        <div className="relative bg-white rounded-lg shadow-lg p-6">
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            &times;
          </button>

          {/* optional title */}
          {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}

          {/* whatever you pass in */}
          <div className="max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AddGenericModal;
