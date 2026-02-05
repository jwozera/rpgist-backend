import { GameAttributes } from './game.model';

export type GameStatus = GameAttributes['status'];

export interface GameInput {
  name: string;
  description: string | null;
  status?: GameStatus;
}

export const GAME_STATUSES: GameStatus[] = ['draft', 'active', 'archived'];

export const isValidGameStatus = (status: string): status is GameStatus =>
  GAME_STATUSES.includes(status as GameStatus);
