"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessCharacter = exports.isCharacterOwner = void 0;
const character_model_1 = require("./character.model");
const gameCharacter_model_1 = require("../game-character/gameCharacter.model");
const game_model_1 = require("../game/game.model");
async function isCharacterOwner(userId, characterId) {
    const character = await character_model_1.Character.findByPk(characterId, { attributes: ['id', 'userId'] });
    return Boolean(character && character.userId === userId);
}
exports.isCharacterOwner = isCharacterOwner;
async function canAccessCharacter(user, characterId) {
    const owner = await isCharacterOwner(user.id, characterId);
    if (owner) {
        return true;
    }
    const association = await gameCharacter_model_1.GameCharacter.findOne({
        where: { characterId },
        include: [
            {
                model: game_model_1.Game,
                as: 'game',
                attributes: ['id', 'ownerUserId']
            }
        ]
    });
    if (!association) {
        return false;
    }
    const game = association.get('game');
    return Boolean(game && game.ownerUserId === user.id);
}
exports.canAccessCharacter = canAccessCharacter;
