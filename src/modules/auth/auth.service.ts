import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

import { AppError } from '../../shared/errors/AppError';
import { userService, UserResponse } from '../users/user.service';

const DEFAULT_SALT_ROUNDS = 10;

interface AuthPayload {
  token: string;
  user: UserResponse;
}

class AuthService {
  async register(email: string, password: string): Promise<AuthPayload> {
    const normalizedEmail = this.normalizeEmail(email);
    const existing = await userService.findByEmail(normalizedEmail);

    if (existing) {
      throw new AppError({ code: 'AUTH.EMAIL_ALREADY_REGISTERED' });
    }

    const passwordHash = await this.hashPassword(password);
    const user = await userService.create(normalizedEmail, passwordHash);
    const token = this.generateToken(user.id);

    return { token, user: userService.toResponse(user) };
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await userService.findByEmail(normalizedEmail);

    if (!user) {
      throw new AppError({ code: 'AUTH.INVALID_CREDENTIALS' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new AppError({ code: 'AUTH.INVALID_CREDENTIALS' });
    }

    const token = this.generateToken(user.id);

    return { token, user: userService.toResponse(user) };
  }

  private normalizeEmail(email: string): string {
    if (!email) {
      throw new AppError({ code: 'USER.EMAIL_REQUIRED' });
    }

    const normalized = email.trim().toLowerCase();

    if (!normalized) {
      throw new AppError({ code: 'USER.EMAIL_REQUIRED' });
    }

    return normalized;
  }

  private async hashPassword(password: string): Promise<string> {
    if (!password || password.length < 8) {
      throw new AppError({ code: 'USER.PASSWORD_TOO_SHORT' });
    }

    const saltRoundsEnv = process.env.BCRYPT_SALT_ROUNDS;
    const rounds = saltRoundsEnv ? Number.parseInt(saltRoundsEnv, 10) : DEFAULT_SALT_ROUNDS;

    if (!Number.isInteger(rounds) || rounds < 4) {
      throw new AppError({ code: 'SYSTEM.INVALID_CONFIG', message: 'Invalid bcrypt salt rounds configuration' });
    }

    return bcrypt.hash(password, rounds);
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError({ code: 'AUTH.JWT_SECRET_MISSING' });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN ?? '1h';
    const options: SignOptions = {
      expiresIn: (Number.isNaN(Number(expiresIn)) ? expiresIn : Number(expiresIn)) as StringValue | number
    };

    return jwt.sign({ userId }, secret, options);
  }
}

export const authService = new AuthService();
