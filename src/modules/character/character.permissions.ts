import { Character } from './character.model';
import { GameCharacter } from '../game-character/gameCharacter.model';
import { Game } from '../game/game.model';

interface UserLike {
  id: string;
}

export async function isCharacterOwner(userId: string, characterId: string): Promise<boolean> {
  const character = await Character.findByPk(characterId, { attributes: ['id', 'userId'] });
  return Boolean(character && character.userId === userId);
}

export async function canAccessCharacter(user: UserLike, characterId: string): Promise<boolean> {
  const owner = await isCharacterOwner(user.id, characterId);

  if (owner) {
    return true;
  }

  const association = await GameCharacter.findOne({
    where: { characterId },
    include: [
      {
        model: Game,
        as: 'game',
        attributes: ['id', 'ownerUserId']
      }
    ]
  });

  if (!association) {
    return false;
  }

  const game = association.get('game') as Game | undefined;

  return Boolean(game && game.ownerUserId === user.id);
}
