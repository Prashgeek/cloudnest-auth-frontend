import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export default function Toast({ show, message, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 max-w-sm w-full bg-white dark:bg-gray-900 border border-green-400 rounded-lg shadow-lg flex items-center p-4 gap-3 z-50"
          role="alert"
          aria-live="assertive"
        >
          <CheckCircle className="text-green-500 w-6 h-6" />
          <div className="flex-1 text-green-700 dark:text-green-400 font-semibold text-sm">
            {message}
          </div>
          <button
            onClick={onClose}
            className="text-green-500 hover:text-green-700 dark:hover:text-green-300"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
