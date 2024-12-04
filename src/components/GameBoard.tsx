import React from "react";
import { Ranchers } from "next/font/google";
import { useDroppable } from '@dnd-kit/core';
import { useAtom } from 'jotai';
import { piecesPositionAtom } from '~/atoms/gameState';
import { tiles } from "~/constants/gameBoard";
const ranchers = Ranchers({
  subsets: ["latin"],
  weight: ["400"],
});

interface TileProps {
  id: string;
  label: string;
  className: string;
}

function DroppableTile({ id, children, className, style }: { id: string; children: React.ReactNode; className: string; style?: React.CSSProperties }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      data-tile={id}
      className={`flex items-center justify-center rounded-lg h-[150px] w-[150px] border-2 border-white border-inset p-4 text-center ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

const GameBoard: React.FC = () => {
 
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-yellow-200 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.svg')] z-0 bg-repeat bg-size-contain bg-center opacity-10"></div>
      <div
        className="grid grid-cols-7 grid-rows-3 gap-x-0 gap-y-0 rounded-lg p-6 z-10 w-[1100px]"
        style={{
          gridTemplateAreas: `
            "tile1 tile2 tile3 tile4 tile5 tile6 tile7"
            "textSection . . . . . tile8"
            "tile15 tile14 tile13 tile12 tile11 tile10 tile9"
            "tile16 . . . . . ."
            "tile17 tile18 tile19 tile20 tile21 tile22 tile23"
          `,
        }}
      >
        <div 
          className={`col-span-6 h-[150px] w-[800px] flex items-center justify-center text-center text-blue-500 opacity-85 text-7xl ${ranchers.className}`} 
          style={{ gridArea: "textSection" }}
        >
          {/* Find Yourself! */}
        </div>
        
        {tiles.map((tile, index) => (
          <DroppableTile
            key={index}
            id={`tile-${index + 1}`}
            style={{ gridArea: `tile${index + 1}` }}
            className={ 
              tile === "START" || tile === "FINISH"
                ? "bg-gradient-to-r from-amber-200 to-purple-300 font-bold text-3xl"
                : tile === "Jump forward 2 spaces!" ||
                  tile === "Bonus turn! Roll the dice again."
                ? "bg-green-300 font-bold "
                : tile === "Go back to 'START'!"
                ? "bg-red-300 "
                : tile === "Reflection"
                ? "bg-blue-200 "
                : tile === "Challenge"
                ? "bg-orange-300 "
                : tile === "Connection"
                ? "bg-red-400"
                : "bg-gray-200 font-bold"
            }
          >
            {tile}
          </DroppableTile>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
