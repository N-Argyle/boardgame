import { motion } from "framer-motion";

interface DiceProps {
  value: number;
  isRolling: boolean;
  onClick: () => void;
}

const DiceRoller = ({ value, isRolling, onClick }: DiceProps) => {
  const dots = [
    // Center dot (for 1, 3, 5)
    value % 2 === 1 && (
      <motion.circle
        key="center"
        cx="50"
        cy="50"
        r="8"
        fill="black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    ),
    
    // Top dot (for 3)
    value === 3 && (
      <motion.circle
        key="top"
        cx="50"
        cy="25"
        r="8"
        fill="black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    ),
    
    // Top left (for 4, 5, 6)
    (value > 3) && (
      <motion.circle
        key="topLeft"
        cx="25"
        cy="25"
        r="8"
        fill="black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    ),
    
    // Top right (for 2, 4, 5, 6)
    (value === 2 || value > 3) && (
      <motion.circle
        key="topRight"
        cx="75"
        cy="25"
        r="8"
        fill="black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    ),
    
    // Middle left (for 6)
    value === 6 && (
      <motion.circle
        key="middleLeft"
        cx="25"
        cy="50"
        r="8"
        fill="black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    ),
    
    // Middle right (for 6)
    value === 6 && (
      <motion.circle
        key="middleRight"
        cx="75"
        cy="50"
        r="8"
        fill="black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    ),
    
    // Bottom dot (for 3)
    value === 3 && (
      <motion.circle
        key="bottom"
        cx="50"
        cy="75"
        r="8"
        fill="black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    ),
    
    // Bottom left (for 2, 4, 5, 6)
    (value === 2 || value > 3) && (
      <motion.circle
        key="bottomLeft"
        cx="25"
        cy="75"
        r="8"
        fill="black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    ),
    
    // Bottom right (for 4, 5, 6)
    value > 3 && (
      <motion.circle
        key="bottomRight"
        cx="75"
        cy="75"
        r="8"
        fill="black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    ),
  ];

  return (
    <motion.div
      className="relative cursor-pointer "
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isRolling ? {
        rotate: [0, 180],
      } : {}}
      transition={{
        duration: isRolling ? .5 : 0.2,
        ease: "easeInOut",
      }}
    >
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="drop-shadow-xl"
        initial={false}
      >
        {/* Static dice face */}
        <rect
          width="100"
          height="100"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />
        <motion.g
          animate={{
            opacity: isRolling ? 0 : 1
          }}
          transition={{
            duration: 0.2,
          }}
        >
          {dots}
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};

export default DiceRoller;