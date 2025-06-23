import { motion } from 'framer-motion';

export const ConfirmModal = ({ title = '¿Estás seguro?', message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="bg-gradient-to-r from-teal-900 to-teal-600 p-1 rounded-xl w-full max-w-md mx-4 my-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative bg-white rounded-lg p-6">
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Confirmar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
