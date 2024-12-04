import { motion } from "framer-motion";
import { useEffect } from "react";

interface TurnAnnouncementProps {
  playerName: string;
  onComplete: () => void;
}

export function TurnAnnouncement({ playerName, onComplete }: TurnAnnouncementProps) {
  useEffect(() => {
    // Wait 2 seconds before triggering the exit animation
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-[1500]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="bg-gradient-to-r from-blue-200 to-purple-200 p-8 rounded-xl shadow-2xl"
      >
        <h1 className="text-5xl font-bold text-center">
          {playerName}&apos;s Turn!
        </h1>
      </motion.div>
    </motion.div>
  );
} 