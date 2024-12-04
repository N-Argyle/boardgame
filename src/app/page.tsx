"use client";

import { useState, useEffect } from "react";
import { DraggableEmoji } from "~/components/DraggableEmoji";
import Card from "~/components/Card";
import { type CardType } from "~/types";
import { cards } from "~/data/cards";
import { AnimatePresence } from "framer-motion";
import { Ranchers } from "next/font/google";
import GameBoard from "~/components/GameBoard";
import DiceRoller from "~/components/DiceRoller";
import { DndContext, type DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useAtom } from 'jotai';
import { piecesPositionAtom } from '~/atoms/gameState';
import { VictoryModal } from "~/components/VictoryModal";
import { tiles } from "~/constants/gameBoard";
import { TurnAnnouncement } from "~/components/TurnAnnouncement";

const ranchers = Ranchers({
  subsets: ["latin"],
  weight: ["400"],
});

// Add a constant for special tile actions
const SPECIAL_ACTIONS: Record<string, (currentTile: number) => { newTile?: number, bonusTurn?: boolean }> = {
  "Jump forward 2 spaces!": (currentTile) => ({ newTile: currentTile + 2 }),
  "Go back 3 spaces!": (currentTile) => ({ newTile: Math.max(1, currentTile - 3) }),
  "Go back to 'START'!": () => ({ newTile: 1 }),
  "Bonus turn! Roll the dice again.": (currentTile) => ({ bonusTurn: true }),
};

export default function HomePage() {
  const [diceResult, setDiceResult] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [currentCard, setCurrentCard] = useState<{
    type: CardType;
    description: string;
  } | null>(null);
  const [drawnCards, setDrawnCards] = useState<Set<string>>(new Set());
  const [positions, setPositions] = useAtom(piecesPositionAtom);
  const [winner, setWinner] = useState<string | null>(null);
  const [lastMovedPiece, setLastMovedPiece] = useState<string | null>(null);
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({
    player1: "Player 1",
    player2: "Player 2",
    player3: "Player 3"
  });
  const [playerTiles, setPlayerTiles] = useState<Record<string, number>>({
    player1: 1,
    player2: 1,
    player3: 1,
  });
  const [showTurnAnnouncement, setShowTurnAnnouncement] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState<string>("");

  useEffect(() => {
    setPositions([
      { id: 'player1', tileId: 'tile-1', order: 0 },
      { id: 'player2', tileId: 'tile-1', order: 1 },
      { id: 'player3', tileId: 'tile-1', order: 2 },
    ]);
  }, []);

  useEffect(() => {
    const players = ['player1', 'player2', 'player3'];
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    setPlayerOrder(shuffledPlayers);
  }, []);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);

  const getTileId = (tileNumber: number) => `tile-${tileNumber}`;

  const rollDice = () => {
    if (isRolling) return;
    
    const currentPlayerId = playerOrder[currentTurnIndex];
    const currentTile = playerTiles[currentPlayerId];
    
    setIsRolling(true);
    
    const rollInterval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
    }, 150);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalResult = Math.floor(Math.random() * 6) + 1;
      setDiceResult(finalResult);
      setIsRolling(false);

      // Calculate initial new position
      const newTile = Math.min(currentTile + finalResult, 23);
      
      // Process special actions after initial move
      const processSpecialAction = (tileNumber: number) => {
        const tileContent = tiles[tileNumber - 1];
        const action = SPECIAL_ACTIONS[tileContent];
        
        if (action) {
          const result = action(tileNumber);
          
          if (result.newTile) {
            // Animate to the new position after a delay
            setTimeout(() => {
              // @ts-expect-error - result.newTile is guaranteed to be a number by the previous check
              setPlayerTiles(prev => ({
                ...prev,
                [currentPlayerId]: result.newTile
              }));
              
              setPositions(prev => {
                const newPositions = prev.filter(p => p.id !== currentPlayerId);
                newPositions.push({
                  id: currentPlayerId,
                  // @ts-expect-error - result.newTile is guaranteed to be a number by the previous check
                  tileId: getTileId(result.newTile),
                  // @ts-expect-error - result.newTile is guaranteed to be a number by the previous check
                  order: prev.filter(p => p.tileId === getTileId(result.newTile)).length
                });
                return newPositions;
              });

              // End turn if it's a backward movement
              // @ts-expect-error - result.newTile is guaranteed to be a number by the previous check
              if (result.newTile < tileNumber && !result.bonusTurn) {
                handleEndTurn();
              }
            }, 1000); // Delay the special movement
          }
          
          if (result.bonusTurn) {
            // Don't advance to next player's turn
            setCurrentTurnIndex(prev => prev);
          }
        }
      };

      // Update initial position
      setPlayerTiles(prev => ({
        ...prev,
        [currentPlayerId]: newTile
      }));

      setPositions(prev => {
        const newPositions = prev.filter(p => p.id !== currentPlayerId);
        newPositions.push({
          id: currentPlayerId,
          tileId: getTileId(newTile),
          order: prev.filter(p => p.tileId === getTileId(newTile)).length
        });
        return newPositions;
      });

      // Delay card modal and special actions
      setTimeout(() => {
        // Process any special actions
        processSpecialAction(newTile);

        // Check for special tiles after movement
        const tileType = getTileType(getTileId(newTile));
        if (tileType && lastMovedPiece !== currentPlayerId) {
          drawCard(tileType);
        }
        
        // Check for victory
        if (newTile === 23) {
          setWinner(playerNames[currentPlayerId]);
        }
      }, 600);
    }, 500);
  };

  const drawCard = (type: CardType) => {
    const cardList = cards[type.toLowerCase() as keyof typeof cards];
    const availableCards = cardList.filter(
      (card) => !drawnCards.has(`${type}-${card}`),
    );

    if (availableCards.length === 0) {
      alert(`No more ${type} cards available!`);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards[randomIndex];

    setDrawnCards((prev) => new Set(prev).add(`${type}-${selectedCard}`));

    setCurrentCard({
      type,
      description: selectedCard,
    });
  };

  const getTileType = (tileId: string): CardType | null => {
    const tileNumber = parseInt(tileId.split('-')[1]);
    const tileContent = tiles[tileNumber - 1];
    
    if (tileContent === "Reflection") return "Reflection";
    if (tileContent === "Challenge") return "Challenge";
    if (tileContent === "Connection") return "Connection";
    return null;
  };

  const getPlayerLabel = (playerId: string) => {
    return playerNames[playerId] ?? playerId;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      if (active.id !== playerOrder[currentTurnIndex]) {
        return;
      }

      setPositions(prev => {
        const currentPosition = prev.find(p => p.id === active.id);
        
        if (currentPosition?.tileId === over.id) {
          return prev;
        }

        const newPositions = prev.filter(p => p.id !== active.id);
        
        const existingPieces = prev.filter(p => p.tileId === over.id);
        newPositions.push({
          id: active.id.toString(),
          tileId: over.id.toString(),
          order: existingPieces.length
        });
        // Check for card type and draw automatically only if it's not the same piece as last time
        const tileType = getTileType(over.id.toString());
        if (tileType && lastMovedPiece !== active.id) {
          drawCard(tileType);
        }
        // Check if player landed on FINISH tile
        if (over.id === 'tile-23') {
          const winningPiece = active.data.current as { label: string };
          setWinner(winningPiece.label);
        }
        
        return newPositions;
      });

      setLastMovedPiece(active.id);
    }
  };

  const handleEndTurn = () => {
    const nextIndex = (currentTurnIndex + 1) % playerOrder.length;
    const nextPlayerId = playerOrder[nextIndex];
    setNextPlayerName(playerNames[nextPlayerId]);
    setShowTurnAnnouncement(true);
  };

  const handlePlayAgain = () => {
    setWinner(null);
    setPositions([]); // Reset positions
    // Add any other reset logic here
  };

  // Update the name change handler
  const handleNameChange = (playerId: string, newName: string) => {
    setPlayerNames(prev => ({
      ...prev,
      [playerId]: newName
    }));
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <main className="flex h-screen flex-row items-start justify-start min-w-[1024px] min-h-[768px] overflow-auto">
        <div className="flex flex-col gap-6 p-4 px-6 items-center justify-start bg-sky-50 h-screen">
          <div className={`${ranchers.className} text-7xl mb-6 mt-4`}>SelfQuest</div>
          
          {playerOrder.length > 0 && (
            <div className="flex flex-col gap-2 items-center">
              <div className="text-xl font-bold mb-4 p-4 bg-white rounded-lg shadow-md">
                Current Turn: {getPlayerLabel(playerOrder[currentTurnIndex])}
              </div>
              <button
                onClick={handleEndTurn}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                End Turn
              </button>
            </div>
          )}
          
          <div className="flex flex-row gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex w-[300px] flex-row items-center justify-center gap-6 rounded-lg border-2 border-black p-4">
                <div className="text-lg">Roll the die!</div>
                <DiceRoller
                  value={diceResult}
                  isRolling={isRolling}
                  onClick={rollDice}
                />
              </div>

              {/* Update the player name editing section to use value instead of defaultValue */}
              <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-center">Player Names</h3>
                <div className="flex flex-col gap-2">
                  {['player1', 'player2', 'player3'].map((playerId) => (
                    <div key={playerId} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={playerNames[playerId]}
                        onChange={(e) => handleNameChange(playerId, e.target.value)}
                        className="px-2 py-1 border rounded w-full"
                        placeholder={`Player ${playerId.slice(-1)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <GameBoard />
        <DraggableEmoji
          emoji="🎁"
          initialLabel={playerNames.player1 ?? "Player 1"}
          id="player1"
          animate={true}
        />
        <DraggableEmoji
          emoji="🚀"
          initialLabel={playerNames.player2 ?? "Player 2"}
          id="player2"
          animate={true}
        />
        <DraggableEmoji
          emoji="🎄"
          initialLabel={playerNames.player3 ?? "Player 3"}
          id="player3"
          animate={true}
        />

        <AnimatePresence>
          {currentCard && (
            <Card
              key={currentCard.type + currentCard.description}
              type={currentCard.type}
              description={currentCard.description}
              onClose={(wasSatisfactory) => {
                if (!wasSatisfactory) {
                  // Get current player
                  const currentPlayerId = playerOrder[currentTurnIndex];
                  const currentTile = playerTiles[currentPlayerId];
                  
                  // Calculate new position (3 spaces back, but not less than 1)
                  const newTile = Math.max(1, currentTile - 3);
                  
                  // Update player position
                  setPlayerTiles(prev => ({
                    ...prev,
                    [currentPlayerId]: newTile
                  }));

                  // Animate to new position
                  setPositions(prev => {
                    const newPositions = prev.filter(p => p.id !== currentPlayerId);
                    newPositions.push({
                      id: currentPlayerId,
                      tileId: getTileId(newTile),
                      order: prev.filter(p => p.tileId === getTileId(newTile)).length
                    });
                    return newPositions;
                  });
                }
                
                // End turn in either case
                setCurrentCard(null);
                handleEndTurn();
              }}
            />
          )}
          {winner && (
            <VictoryModal
              playerLabel={winner}
              onClose={handlePlayAgain}
            />
          )}
          {showTurnAnnouncement && (
            <TurnAnnouncement
              playerName={nextPlayerName}
              onComplete={() => {
                setShowTurnAnnouncement(false);
                setCurrentTurnIndex((prev) => (prev + 1) % playerOrder.length);
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </DndContext>
  );
}
