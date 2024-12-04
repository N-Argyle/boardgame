import { CardType } from "~/types";
import { motion } from "framer-motion";

interface CardProps {
  type: CardType;
  description: string;
  onClose: (wasSatisfactory: boolean) => void;
}

export default function Card({ type, description, onClose }: CardProps) {
  const getCardClasses = () => {
    switch (type) {
      case "Reflection":
        return {
          text: "text-blue-500",
          bg: "bg-blue-500 hover:bg-blue-600",
          unsatisfactoryBg: "bg-red-500 hover:bg-red-600",
          satisfactoryBg: "bg-green-500 hover:bg-green-600",
        };
      case "Challenge":
        return {
          text: "text-orange-500",
          bg: "bg-orange-500 hover:bg-orange-600",
          unsatisfactoryBg: "bg-red-500 hover:bg-red-600",
          satisfactoryBg: "bg-green-500 hover:bg-green-600",
        };
      case "Connection":
        return {
          text: "text-red-500",
          bg: "bg-red-500 hover:bg-red-600",
          unsatisfactoryBg: "bg-red-700 hover:bg-red-800",
          satisfactoryBg: "bg-green-500 hover:bg-green-600",
        };
    }
  };
  
  const classes = getCardClasses();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-lg z-[2000]"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        className="w-96 rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`mb-4 text-3xl font-bold ${classes.text}`}>{type}</h2>
        <p className="mb-6 text-lg">{description}</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={() => onClose(false)}
            className={`flex-1 rounded px-4 py-2 text-white ${classes.unsatisfactoryBg}`}
          >
            Unsatisfactory
          </button>
          <button
            onClick={() => onClose(true)}
            className={`flex-1 rounded px-4 py-2 text-white ${classes.satisfactoryBg}`}
          >
            Satisfactory
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
