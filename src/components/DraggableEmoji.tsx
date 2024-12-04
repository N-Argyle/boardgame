import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { piecesPositionAtom } from '~/atoms/gameState';

interface DraggableEmojiProps {
  emoji: string;
  initialLabel: string;
  id: string;
  animate?: boolean;
}

const OFFSET_AMOUNT = 30;
const BASE_OFFSET = -32;
const BASE_Z_INDEX = 1000;

export function DraggableEmoji({ emoji, initialLabel, id, animate = false }: DraggableEmojiProps) {
  const [positions, setPositions] = useAtom(piecesPositionAtom);
  const [zIndex, setZIndex] = useState(BASE_Z_INDEX);
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      type: 'emoji',
      label: initialLabel,
      emoji
    }
  });

  const position = positions.find(p => p.id === id);
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: zIndex,
  } : {
    zIndex: zIndex,
  };

  if (position) {
    const tileElement = document.querySelector(`[data-tile="${position.tileId}"]`);
    if (tileElement) {
      const rect = tileElement.getBoundingClientRect();
      const elementWidth = 80;
      const elementHeight = 80;
      
      const centerX = rect.left + (rect.width - elementWidth) / 2;
      const centerY = rect.top + (rect.height - elementHeight) / 2;
      
      const piecesOnTile = positions.filter(p => p.tileId === position.tileId);
      const stackOffset = piecesOnTile.length > 1 ? BASE_OFFSET : 0;
      
      const offsetX = position.order * OFFSET_AMOUNT + stackOffset;
      const offsetY = position.order * OFFSET_AMOUNT + stackOffset;

      const updatedStyle = {
        ...style,
        position: 'absolute' as const,
        left: `${centerX + offsetX}px`,
        top: `${centerY + offsetY}px`
      };
      Object.assign(style, updatedStyle);
      if (animate) {
        Object.assign(style, {
          transition: 'all 0.5s ease-in-out'
        });
      }
    }
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-piece-id={id}
      className="absolute select-none cursor-move z-10 backdrop-blur-md bg-white/30 rounded-md px-1 py-2 border border-black"
      style={style}
    >
      <div className="text-6xl text-center leading-none">
        {emoji}
      </div>
      <div className="text-center px-2 text-black rounded shadow-sm">
        {initialLabel}
      </div>
    </div>
  );
}