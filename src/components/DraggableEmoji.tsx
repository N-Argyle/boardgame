import { useState, type MouseEvent, useEffect } from "react";

interface DraggableEmojiProps {
  emoji: string;
  initialX?: number;
  initialY?: number;
  initialLabel?: string;
}

export function DraggableEmoji({ 
  emoji, 
  initialX = 0, 
  initialY = 0,
  initialLabel = "Label" 
}: DraggableEmojiProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [label, setLabel] = useState(initialLabel);
  const [isEditing, setIsEditing] = useState(false);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Add event listeners to window
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleLabelClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div
      className="fixed select-none cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          onBlur={handleLabelBlur}
          onKeyDown={handleKeyDown}
          className="block w-full text-center px-2 py-1 text-black font-bold bg-white rounded shadow-sm"
          autoFocus
        />
      ) : (
        <div 
          onClick={handleLabelClick}
          className="text-center px-2 text-black bg-white rounded shadow-sm mb-1"
        >
          {label}
        </div>
      )}
      <div className="text-6xl text-center">
        {emoji}
      </div>
    </div>
  );
}