"use client";

import { useState } from "react";
import { DraggableEmoji } from "~/components/DraggableEmoji";

export default function HomePage() {
  const [diceResult, setDiceResult] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    let rolls = 0;
    const maxRolls = 10;
    
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      rolls++;
      
      if (rolls >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 100);
  };

  return (
    <main className="flex min-h-screen flex-row items-center justify-center gap-4">
      
      <div className="text-center w-[300px]">
        <button
          onClick={rollDice}
          disabled={isRolling}
          className="mb-4 rounded-full bg-slate-300 px-10 py-3 font-semibold  no-underline transition hover:bg-white/20 disabled:opacity-50"
        >
          Roll Die
        </button>
        <div className={`text-8xl ${isRolling ? "animate-bounce" : ""}`}>
          {["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][diceResult - 1]}
        </div>
      </div>
      <img src="/board.png" alt="board" className="w-[calc(100vw-300px)] max-h-screen" />
      <DraggableEmoji emoji="🎁" initialLabel="Player 1" initialX={100} initialY={100} />
      <DraggableEmoji emoji="🚀" initialLabel="Player 2" initialX={100} initialY={150} />
      <DraggableEmoji emoji="🎄" initialLabel="Player 3" initialX={100} initialY={200} />
    </main>
  );
}
