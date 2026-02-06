"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
require("pg");
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const attribute_model_1 = require("../modules/character/attribute.model");
const character_model_1 = require("../modules/character/character.model");
const cyberware_model_1 = require("../modules/character/cyberware.model");
const enhancement_model_1 = require("../modules/character/enhancement.model");
const psi_power_model_1 = require("../modules/character/psi-power.model");
const skill_model_1 = require("../modules/character/skill.model");
const game_model_1 = require("../modules/game/game.model");
const gameCharacter_model_1 = require("../modules/game-character/gameCharacter.model");
const user_model_1 = require("../modules/users/user.model");
const environment = process.env.NODE_ENV || 'development';
const config = (0, database_1.getDatabaseConfig)(environment);
const sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
exports.sequelize = sequelize;
character_model_1.Character.initialize(sequelize);
attribute_model_1.Attribute.initialize(sequelize);
skill_model_1.Skill.initialize(sequelize);
cyberware_model_1.Cyberware.initialize(sequelize);
psi_power_model_1.PsiPower.initialize(sequelize);
enhancement_model_1.Enhancement.initialize(sequelize);
user_model_1.User.initialize(sequelize);
game_model_1.Game.initialize(sequelize);
gameCharacter_model_1.GameCharacter.initialize(sequelize);
character_model_1.Character.belongsTo(user_model_1.User, {
    as: 'user',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    hooks: true
});
user_model_1.User.hasMany(character_model_1.Character, {
    as: 'characters',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    hooks: true
});
game_model_1.Game.belongsTo(user_model_1.User, {
    as: 'owner',
    foreignKey: 'ownerUserId',
    onDelete: 'CASCADE',
    hooks: true
});
user_model_1.User.hasMany(game_model_1.Game, {
    as: 'ownedGames',
    foreignKey: 'ownerUserId',
    onDelete: 'CASCADE',
    hooks: true
});
character_model_1.Character.hasMany(attribute_model_1.Attribute, {
    as: 'attributes',
    foreignKey: 'characterId',
    onDelete: 'CASCADE',
    hooks: true
});
attribute_model_1.Attribute.belongsTo(character_model_1.Character, {
    as: 'character',
    foreignKey: 'characterId'
});
character_model_1.Character.hasMany(skill_model_1.Skill, {
    as: 'skills',
    foreignKey: 'characterId',
    onDelete: 'CASCADE',
    hooks: true
});
skill_model_1.Skill.belongsTo(character_model_1.Character, {
    as: 'character',
    foreignKey: 'characterId'
});
character_model_1.Character.hasMany(cyberware_model_1.Cyberware, {
    as: 'cyberwares',
    foreignKey: 'characterId',
    onDelete: 'CASCADE',
    hooks: true
});
cyberware_model_1.Cyberware.belongsTo(character_model_1.Character, {
    as: 'character',
    foreignKey: 'characterId'
});
character_model_1.Character.hasMany(psi_power_model_1.PsiPower, {
    as: 'psiPowers',
    foreignKey: 'characterId',
    onDelete: 'CASCADE',
    hooks: true
});
psi_power_model_1.PsiPower.belongsTo(character_model_1.Character, {
    as: 'character',
    foreignKey: 'characterId'
});
character_model_1.Character.hasMany(enhancement_model_1.Enhancement, {
    as: 'enhancements',
    foreignKey: 'characterId',
    onDelete: 'CASCADE',
    hooks: true
});
enhancement_model_1.Enhancement.belongsTo(character_model_1.Character, {
    as: 'character',
    foreignKey: 'characterId'
});
character_model_1.Character.hasMany(gameCharacter_model_1.GameCharacter, {
    as: 'gameMemberships',
    foreignKey: 'characterId',
    onDelete: 'CASCADE',
    hooks: true
});
gameCharacter_model_1.GameCharacter.belongsTo(character_model_1.Character, {
    as: 'character',
    foreignKey: 'characterId',
    onDelete: 'CASCADE',
    hooks: true
});
gameCharacter_model_1.GameCharacter.belongsTo(user_model_1.User, {
    as: 'player',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    hooks: true
});
user_model_1.User.hasMany(gameCharacter_model_1.GameCharacter, {
    as: 'gameMemberships',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    hooks: true
});
game_model_1.Game.hasMany(gameCharacter_model_1.GameCharacter, {
    as: 'participants',
    foreignKey: 'gameId',
    onDelete: 'CASCADE',
    hooks: true
});
gameCharacter_model_1.GameCharacter.belongsTo(game_model_1.Game, {
    as: 'game',
    foreignKey: 'gameId',
    onDelete: 'CASCADE',
    hooks: true
});
