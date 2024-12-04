import { atom } from 'jotai';

export interface PiecePosition {
  id: string;
  tileId: string;
  order: number;
}

export const piecesPositionAtom = atom<PiecePosition[]>([]);
