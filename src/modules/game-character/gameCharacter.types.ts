import { GameCharacterStatus } from './gameCharacter.model';

export interface GameCharacterJoinInput {
  gameId: string;
  characterId: string;
}

export interface GameCharacterStateUpdateInput {
  hpCurrent?: number | null;
  hpTotal?: number | null;
  conditions?: string[] | null;
  temporaryModifiers?: Record<string, unknown> | null;
}

export interface GameCharacterResponse {
  id: string;
  gameId: string;
  characterId: string;
  userId: string;
  status: GameCharacterStatus;
  hpCurrent: number | null;
  hpTotal: number | null;
  conditions: string[];
  temporaryModifiers: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  game?: {
    id: string;
    name: string;
    ownerUserId: string;
  };
  character?: {
    id: string;
    name: string;
    userId: string;
  };
}
