import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../shared/errors/AppError';

import { canAccessCharacter, isCharacterOwner } from './character.permissions';
import { characterService } from './character.service';
import {
  CharacterPayload,
  isValidAttribute,
  isValidEnhancementType,
  isValidSkillCategory
} from './character.types';

class CharacterController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const data = await characterService.list(userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = this.getIdFromRequest(req);
      const userId = this.getUserId(req);
      const hasAccess = await canAccessCharacter({ id: userId }, id);

      if (!hasAccess) {
        throw new AppError({ code: 'CHARACTER.NOT_FOUND' });
      }

      const data = await characterService.getByIdWithComputed(id, userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const payload = this.parsePayload(req.body);
      const data = await characterService.create(userId, payload);
      res.status(201).json({ character: data });
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = this.getIdFromRequest(req);
      const userId = this.getUserId(req);
      const owner = await isCharacterOwner(userId, id);

      if (owner) {
        const payload = this.parsePayload(req.body);
        const data = await characterService.updateAsOwner(id, userId, payload);
        res.json({ character: data });
        return;
      }

      throw new AppError({ code: 'CHARACTER.NOT_FOUND' });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = this.getIdFromRequest(req);
      const userId = this.getUserId(req);
      await characterService.remove(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  private getUserId(req: Request): string {
    const { userId } = req;

    if (!userId) {
      throw new AppError({ code: 'AUTH.UNAUTHORIZED' });
    }

    return userId;
  }

  private getIdFromRequest(req: Request): string {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || !this.isUuid(id)) {
      throw new AppError({ code: 'REQUEST.INVALID_IDENTIFIER', message: 'Invalid character id' });
    }

    return id;
  }

  private isUuid(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  private parsePayload(body: unknown): CharacterPayload {
    if (!body || typeof body !== 'object') {
      throw new AppError({ code: 'REQUEST.INVALID_BODY' });
    }

    const payload = body as Partial<CharacterPayload> & { character?: Record<string, unknown> };

    if (!payload.character) {
      throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Character payload is required' });
    }

    const character = this.parseCharacter(payload.character);

    const attributes = this.parseAttributes(payload.attributes);
    const skills = this.parseSkills(payload.skills);
    const cyberwares = this.parseCyberwares(payload.cyberwares);
    const psiPowers = this.parsePsiPowers(payload.psiPowers);
    const enhancements = this.parseEnhancements(payload.enhancements);

    return {
      character,
      attributes,
      skills,
      cyberwares,
      psiPowers,
      enhancements
    };
  }

  private parseCharacter(data: Record<string, unknown>): CharacterPayload['character'] {
    const requiredFields: Array<keyof CharacterPayload['character']> = [
      'name',
      'profession',
      'ageReal',
      'ageApparent',
      'heightCm',
      'weightKg'
    ];

    for (const field of requiredFields) {
      if (data[field as string] === undefined || data[field as string] === null) {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: `Field ${String(field)} is required`
        });
      }
    }

    const sanitizeNumber = (value: unknown, field: string): number => {
      if (typeof value !== 'number') {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: `Field ${field} must be a number`
        });
      }

      return value;
    };

    const resources =
      typeof data.resources === 'object' && data.resources !== null
        ? (data.resources as Record<string, unknown>)
        : {};

    return {
      name: typeof data.name === 'string' ? data.name : this.requiredString('name', data.name),
      profession:
        typeof data.profession === 'string' ? data.profession : this.requiredString('profession', data.profession),
      level: data.level === undefined ? 1 : sanitizeNumber(data.level, 'level'),
      xp: data.xp === undefined ? 0 : sanitizeNumber(data.xp, 'xp'),
      ageReal: sanitizeNumber(data.ageReal, 'ageReal'),
      ageApparent: sanitizeNumber(data.ageApparent, 'ageApparent'),
      heightCm: sanitizeNumber(data.heightCm, 'heightCm'),
      weightKg: sanitizeNumber(data.weightKg, 'weightKg'),
      imageUrl: typeof data.imageUrl === 'string' || data.imageUrl === null ? data.imageUrl ?? null : null,
      resources
    };
  }

  private parseAttributes(items: CharacterPayload['attributes']): CharacterPayload['attributes'] {
    if (!items) {
      return [];
    }

    if (!Array.isArray(items)) {
      throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Attributes must be an array' });
    }

    return items.map((attribute) => {
      if (!isValidAttribute(attribute.attributeId)) {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: `Invalid attributeId: ${String(attribute.attributeId)}`
        });
      }

      if (typeof attribute.base !== 'number') {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: 'Attribute base must be a number'
        });
      }

      return {
        attributeId: attribute.attributeId,
        base: attribute.base
      };
    });
  }

  private parseSkills(items: CharacterPayload['skills']): CharacterPayload['skills'] {
    if (!items) {
      return [];
    }

    if (!Array.isArray(items)) {
      throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Skills must be an array' });
    }

    return items.map((skill) => {
      if (!isValidSkillCategory(skill.category)) {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: `Invalid skill category: ${String(skill.category)}`
        });
      }

      if (!isValidAttribute(skill.baseAttribute)) {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: `Invalid base attribute: ${String(skill.baseAttribute)}`
        });
      }

      if (typeof skill.name !== 'string') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Skill name must be a string' });
      }

      if (skill.misc !== undefined && typeof skill.misc !== 'number') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Skill misc must be a number' });
      }

      if (skill.rof !== undefined && skill.rof !== null && typeof skill.rof !== 'number') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Skill rof must be a number' });
      }

      return {
        name: skill.name,
        category: skill.category,
        baseAttribute: skill.baseAttribute,
        invested: typeof skill.invested === 'object' && skill.invested !== null ? skill.invested : {},
        misc: skill.misc ?? 0,
        damage: typeof skill.damage === 'string' ? skill.damage : null,
        rof: skill.rof ?? null
      };
    });
  }

  private parseCyberwares(items: CharacterPayload['cyberwares']): CharacterPayload['cyberwares'] {
    if (!items) {
      return [];
    }

    if (!Array.isArray(items)) {
      throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Cyberwares must be an array' });
    }

    return items.map((item) => {
      if (typeof item.name !== 'string') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Cyberware name must be a string' });
      }

      if (typeof item.description !== 'string') {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: 'Cyberware description must be a string'
        });
      }

      if (typeof item.cost !== 'number') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Cyberware cost must be a number' });
      }

      return {
        name: item.name,
        description: item.description,
        cost: item.cost,
        modifiers: typeof item.modifiers === 'object' && item.modifiers !== null ? item.modifiers : {},
        skillModifiers:
          typeof item.skillModifiers === 'object' && item.skillModifiers !== null ? item.skillModifiers : {}
      };
    });
  }

  private parsePsiPowers(items: CharacterPayload['psiPowers']): CharacterPayload['psiPowers'] {
    if (!items) {
      return [];
    }

    if (!Array.isArray(items)) {
      throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Psi powers must be an array' });
    }

    return items.map((item) => {
      if (typeof item.name !== 'string') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Psi power name must be a string' });
      }

      if (typeof item.notes !== 'string') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Psi power notes must be a string' });
      }

      if (typeof item.focus !== 'number') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Psi power focus must be a number' });
      }

      return {
        name: item.name,
        notes: item.notes,
        focus: item.focus
      };
    });
  }

  private parseEnhancements(items: CharacterPayload['enhancements']): CharacterPayload['enhancements'] {
    if (!items) {
      return [];
    }

    if (!Array.isArray(items)) {
      throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Enhancements must be an array' });
    }

    return items.map((item) => {
      if (!isValidEnhancementType(item.type)) {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: `Invalid enhancement type: ${String(item.type)}`
        });
      }

      if (typeof item.cost !== 'number') {
        throw new AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Enhancement cost must be a number' });
      }

      if (typeof item.description !== 'string') {
        throw new AppError({
          code: 'REQUEST.VALIDATION_FAILED',
          message: 'Enhancement description must be a string'
        });
      }

      // Only allow title for custom enhancements
      let title: string | undefined = undefined;
      if (item.type === 'custom') {
        if (item.title !== undefined && item.title !== null) {
          if (typeof item.title !== 'string') {
            throw new AppError({
              code: 'REQUEST.VALIDATION_FAILED',
              message: 'Enhancement title must be a string'
            });
          }
          title = item.title;
        }
      }

      return {
        type: item.type,
        cost: item.cost,
        description: item.description,
        ...(title !== undefined ? { title } : {})
      };
    });
  }

  private requiredString(field: string, value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new AppError({
        code: 'REQUEST.VALIDATION_FAILED',
        message: `Field ${field} must be a non-empty string`
      });
    }

    return value;
  }
}

export const characterController = new CharacterController();
