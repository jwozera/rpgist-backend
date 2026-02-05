import { Sequelize } from 'sequelize';

import { getDatabaseConfig } from '../config/database';
import { Attribute } from '../modules/character/attribute.model';
import { Character } from '../modules/character/character.model';
import { Cyberware } from '../modules/character/cyberware.model';
import { Enhancement } from '../modules/character/enhancement.model';
import { PsiPower } from '../modules/character/psi-power.model';
import { Skill } from '../modules/character/skill.model';
import { Game } from '../modules/game/game.model';
import { GameCharacter } from '../modules/game-character/gameCharacter.model';
import { User } from '../modules/users/user.model';

const environment = process.env.NODE_ENV || 'development';
const config = getDatabaseConfig(environment);

const sequelize = new Sequelize(
  config.database as string,
  config.username,
  config.password,
  config
);

Character.initialize(sequelize);
Attribute.initialize(sequelize);
Skill.initialize(sequelize);
Cyberware.initialize(sequelize);
PsiPower.initialize(sequelize);
Enhancement.initialize(sequelize);
User.initialize(sequelize);
Game.initialize(sequelize);
GameCharacter.initialize(sequelize);

Character.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  hooks: true
});

User.hasMany(Character, {
  as: 'characters',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  hooks: true
});

Game.belongsTo(User, {
  as: 'owner',
  foreignKey: 'ownerUserId',
  onDelete: 'CASCADE',
  hooks: true
});

User.hasMany(Game, {
  as: 'ownedGames',
  foreignKey: 'ownerUserId',
  onDelete: 'CASCADE',
  hooks: true
});

Character.hasMany(Attribute, {
  as: 'attributes',
  foreignKey: 'characterId',
  onDelete: 'CASCADE',
  hooks: true
});
Attribute.belongsTo(Character, {
  as: 'character',
  foreignKey: 'characterId'
});

Character.hasMany(Skill, {
  as: 'skills',
  foreignKey: 'characterId',
  onDelete: 'CASCADE',
  hooks: true
});
Skill.belongsTo(Character, {
  as: 'character',
  foreignKey: 'characterId'
});

Character.hasMany(Cyberware, {
  as: 'cyberwares',
  foreignKey: 'characterId',
  onDelete: 'CASCADE',
  hooks: true
});
Cyberware.belongsTo(Character, {
  as: 'character',
  foreignKey: 'characterId'
});

Character.hasMany(PsiPower, {
  as: 'psiPowers',
  foreignKey: 'characterId',
  onDelete: 'CASCADE',
  hooks: true
});
PsiPower.belongsTo(Character, {
  as: 'character',
  foreignKey: 'characterId'
});

Character.hasMany(Enhancement, {
  as: 'enhancements',
  foreignKey: 'characterId',
  onDelete: 'CASCADE',
  hooks: true
});
Enhancement.belongsTo(Character, {
  as: 'character',
  foreignKey: 'characterId'
});

Character.hasMany(GameCharacter, {
  as: 'gameMemberships',
  foreignKey: 'characterId',
  onDelete: 'CASCADE',
  hooks: true
});

GameCharacter.belongsTo(Character, {
  as: 'character',
  foreignKey: 'characterId',
  onDelete: 'CASCADE',
  hooks: true
});

GameCharacter.belongsTo(User, {
  as: 'player',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  hooks: true
});

User.hasMany(GameCharacter, {
  as: 'gameMemberships',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  hooks: true
});

Game.hasMany(GameCharacter, {
  as: 'participants',
  foreignKey: 'gameId',
  onDelete: 'CASCADE',
  hooks: true
});

GameCharacter.belongsTo(Game, {
  as: 'game',
  foreignKey: 'gameId',
  onDelete: 'CASCADE',
  hooks: true
});

export { sequelize };
