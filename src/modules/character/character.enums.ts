export const ATTRIBUTE_TYPES = [
  'CON',
  'FOR',
  'DEX',
  'AGI',
  'INT',
  'WILL',
  'PER',
  'CAR'
] as const;

export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];

export const SKILL_CATEGORIES = ['geral', 'combate_melee', 'combate_ranged'] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const ENHANCEMENT_TYPES = ['cyberware', 'psi', 'heroic'] as const;

export type EnhancementType = (typeof ENHANCEMENT_TYPES)[number];
