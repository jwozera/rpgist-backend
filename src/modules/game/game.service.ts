import { Game, GameAttributes, GameCreationAttributes } from './game.model';
import { GameInput, GameStatus } from './game.types';
import { AppError } from '../../shared/errors/AppError';

export interface GameResponse {
  id: string;
  name: string;
  description: string | null;
  status: GameStatus;
  ownerUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameUpdateInput {
  name?: string;
  description?: string | null;
  status?: GameStatus;
}

class GameService {
  async create(ownerUserId: string, input: GameInput): Promise<GameResponse> {
    const payload: GameCreationAttributes = {
      name: input.name,
      description: input.description,
      status: input.status ?? 'draft',
      ownerUserId
    };

    const game = await Game.create(payload);
    return this.toResponse(game);
  }

  async listByOwner(ownerUserId: string): Promise<GameResponse[]> {
    const games = await Game.findAll({ where: { ownerUserId }, order: [['createdAt', 'DESC']] });
    return games.map((game) => this.toResponse(game));
  }

  async listAll(): Promise<GameResponse[]> {
    const games = await Game.findAll({ order: [['createdAt', 'DESC']] });
    return games.map((game) => this.toResponse(game));
  }

  async getById(id: string, ownerUserId: string): Promise<GameResponse> {
    const game = await Game.findOne({ where: { id, ownerUserId } });

    if (!game) {
      throw new AppError({ code: 'GAME.NOT_FOUND' });
    }

    return this.toResponse(game);
  }

  async update(game: Game, input: GameUpdateInput): Promise<GameResponse> {
    if (input.name !== undefined) {
      game.name = input.name;
    }

    if (input.description !== undefined) {
      game.description = input.description;
    }

    if (input.status !== undefined) {
      game.status = input.status;
    }

    await game.save();
    return this.toResponse(game);
  }

  async delete(game: Game): Promise<void> {
    await game.destroy();
  }

  toResponse(game: Game): GameResponse {
    const json = game.toJSON() as GameAttributes;

    return {
      id: json.id,
      name: json.name,
      description: json.description ?? null,
      status: json.status,
      ownerUserId: json.ownerUserId,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    };
  }
}

export const gameService = new GameService();
