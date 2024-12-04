import { motion } from "framer-motion";

interface VictoryModalProps {
  playerLabel: string;
  onClose: () => void;
}

export function VictoryModal({ playerLabel, onClose }: VictoryModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-lg z-[2000]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="bg-gradient-to-r from-amber-200 to-purple-300 p-12 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-7xl font-bold text-center mb-8">
          🎉 {playerLabel} Wins! 🎉
        </h1>
        <button
          onClick={onClose}
          className="block mx-auto px-6 py-3 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
} 