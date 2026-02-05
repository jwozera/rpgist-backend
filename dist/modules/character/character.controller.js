"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterController = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const character_permissions_1 = require("./character.permissions");
const character_service_1 = require("./character.service");
const character_types_1 = require("./character.types");
class CharacterController {
    async list(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const data = await character_service_1.characterService.list(userId);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = this.getIdFromRequest(req);
            const userId = this.getUserId(req);
            const hasAccess = await (0, character_permissions_1.canAccessCharacter)({ id: userId }, id);
            if (!hasAccess) {
                throw new AppError_1.AppError({ code: 'CHARACTER.NOT_FOUND' });
            }
            const data = await character_service_1.characterService.getByIdWithComputed(id, userId);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const userId = this.getUserId(req);
            const payload = this.parsePayload(req.body);
            const data = await character_service_1.characterService.create(userId, payload);
            res.status(201).json({ character: data });
        }
        catch (error) {
            next(error);
        }
    }
    async patch(req, res, next) {
        try {
            const id = this.getIdFromRequest(req);
            const userId = this.getUserId(req);
            const owner = await (0, character_permissions_1.isCharacterOwner)(userId, id);
            if (owner) {
                const payload = this.parsePayload(req.body);
                const data = await character_service_1.characterService.updateAsOwner(id, userId, payload);
                res.json({ character: data });
                return;
            }
            throw new AppError_1.AppError({ code: 'CHARACTER.NOT_FOUND' });
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            const id = this.getIdFromRequest(req);
            const userId = this.getUserId(req);
            await character_service_1.characterService.remove(id, userId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    getUserId(req) {
        const { userId } = req;
        if (!userId) {
            throw new AppError_1.AppError({ code: 'AUTH.UNAUTHORIZED' });
        }
        return userId;
    }
    getIdFromRequest(req) {
        const { id } = req.params;
        if (!id || typeof id !== 'string' || !this.isUuid(id)) {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_IDENTIFIER', message: 'Invalid character id' });
        }
        return id;
    }
    isUuid(value) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
    parsePayload(body) {
        if (!body || typeof body !== 'object') {
            throw new AppError_1.AppError({ code: 'REQUEST.INVALID_BODY' });
        }
        const payload = body;
        if (!payload.character) {
            throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Character payload is required' });
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
    parseCharacter(data) {
        const requiredFields = [
            'name',
            'profession',
            'ageReal',
            'ageApparent',
            'heightCm',
            'weightKg'
        ];
        for (const field of requiredFields) {
            if (data[field] === undefined || data[field] === null) {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: `Field ${String(field)} is required`
                });
            }
        }
        const sanitizeNumber = (value, field) => {
            if (typeof value !== 'number') {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: `Field ${field} must be a number`
                });
            }
            return value;
        };
        const resources = typeof data.resources === 'object' && data.resources !== null
            ? data.resources
            : {};
        return {
            name: typeof data.name === 'string' ? data.name : this.requiredString('name', data.name),
            profession: typeof data.profession === 'string' ? data.profession : this.requiredString('profession', data.profession),
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
    parseAttributes(items) {
        if (!items) {
            return [];
        }
        if (!Array.isArray(items)) {
            throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Attributes must be an array' });
        }
        return items.map((attribute) => {
            if (!(0, character_types_1.isValidAttribute)(attribute.attributeId)) {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: `Invalid attributeId: ${String(attribute.attributeId)}`
                });
            }
            if (typeof attribute.base !== 'number') {
                throw new AppError_1.AppError({
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
    parseSkills(items) {
        if (!items) {
            return [];
        }
        if (!Array.isArray(items)) {
            throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Skills must be an array' });
        }
        return items.map((skill) => {
            if (!(0, character_types_1.isValidSkillCategory)(skill.category)) {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: `Invalid skill category: ${String(skill.category)}`
                });
            }
            if (!(0, character_types_1.isValidAttribute)(skill.baseAttribute)) {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: `Invalid base attribute: ${String(skill.baseAttribute)}`
                });
            }
            if (typeof skill.name !== 'string') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Skill name must be a string' });
            }
            if (skill.misc !== undefined && typeof skill.misc !== 'number') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Skill misc must be a number' });
            }
            if (skill.rof !== undefined && skill.rof !== null && typeof skill.rof !== 'number') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Skill rof must be a number' });
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
    parseCyberwares(items) {
        if (!items) {
            return [];
        }
        if (!Array.isArray(items)) {
            throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Cyberwares must be an array' });
        }
        return items.map((item) => {
            if (typeof item.name !== 'string') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Cyberware name must be a string' });
            }
            if (typeof item.description !== 'string') {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: 'Cyberware description must be a string'
                });
            }
            if (typeof item.cost !== 'number') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Cyberware cost must be a number' });
            }
            return {
                name: item.name,
                description: item.description,
                cost: item.cost,
                modifiers: typeof item.modifiers === 'object' && item.modifiers !== null ? item.modifiers : {},
                skillModifiers: typeof item.skillModifiers === 'object' && item.skillModifiers !== null ? item.skillModifiers : {}
            };
        });
    }
    parsePsiPowers(items) {
        if (!items) {
            return [];
        }
        if (!Array.isArray(items)) {
            throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Psi powers must be an array' });
        }
        return items.map((item) => {
            if (typeof item.name !== 'string') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Psi power name must be a string' });
            }
            if (typeof item.notes !== 'string') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Psi power notes must be a string' });
            }
            if (typeof item.focus !== 'number') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Psi power focus must be a number' });
            }
            return {
                name: item.name,
                notes: item.notes,
                focus: item.focus
            };
        });
    }
    parseEnhancements(items) {
        if (!items) {
            return [];
        }
        if (!Array.isArray(items)) {
            throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Enhancements must be an array' });
        }
        return items.map((item) => {
            if (!(0, character_types_1.isValidEnhancementType)(item.type)) {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: `Invalid enhancement type: ${String(item.type)}`
                });
            }
            if (typeof item.cost !== 'number') {
                throw new AppError_1.AppError({ code: 'REQUEST.VALIDATION_FAILED', message: 'Enhancement cost must be a number' });
            }
            if (typeof item.description !== 'string') {
                throw new AppError_1.AppError({
                    code: 'REQUEST.VALIDATION_FAILED',
                    message: 'Enhancement description must be a string'
                });
            }
            return {
                type: item.type,
                cost: item.cost,
                description: item.description
            };
        });
    }
    requiredString(field, value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new AppError_1.AppError({
                code: 'REQUEST.VALIDATION_FAILED',
                message: `Field ${field} must be a non-empty string`
            });
        }
        return value;
    }
}
exports.characterController = new CharacterController();
