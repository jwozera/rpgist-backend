import { ATTRIBUTE_TYPES, AttributeType, ENHANCEMENT_TYPES, EnhancementType, SKILL_CATEGORIES, SkillCategory } from './character.enums';

export interface CharacterInput {
  name: string;
  profession: string;
  level?: number;
  xp?: number;
  ageReal: number;
  ageApparent: number;
  heightCm: number;
  weightKg: number;
  imageUrl?: string | null;
  resources?: Record<string, unknown>;
}

export interface AttributeInput {
  attributeId: AttributeType;
  base: number;
}

export interface SkillInput {
  name: string;
  category: SkillCategory;
  baseAttribute: AttributeType;
  invested?: Record<string, unknown>;
  misc?: number;
  damage?: string | null;
  rof?: number | null;
}

export interface CyberwareInput {
  name: string;
  description: string;
  cost: number;
  modifiers?: Record<string, unknown>;
  skillModifiers?: Record<string, unknown>;
}

export interface PsiPowerInput {
  name: string;
  notes: string;
  focus: number;
}

export interface EnhancementInput {
  type: EnhancementType;
  cost: number;
  description: string;
}

export interface CharacterPayload {
  character: CharacterInput;
  attributes?: AttributeInput[];
  skills?: SkillInput[];
  cyberwares?: CyberwareInput[];
  psiPowers?: PsiPowerInput[];
  enhancements?: EnhancementInput[];
}

export const isValidAttribute = (value: string): value is AttributeType => ATTRIBUTE_TYPES.includes(value as AttributeType);

export const isValidSkillCategory = (value: string): value is SkillCategory => SKILL_CATEGORIES.includes(value as SkillCategory);

export const isValidEnhancementType = (value: string): value is EnhancementType => ENHANCEMENT_TYPES.includes(value as EnhancementType);
