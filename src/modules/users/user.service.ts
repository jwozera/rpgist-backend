import bcrypt from 'bcrypt';

import { AppError } from '../../shared/errors/AppError';

import { User, UserAttributes } from './user.model';

export interface UserResponse {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserInput {
  displayName?: string | null;
  email?: string;
  password?: string;
}

class UserService {
  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async create(email: string, passwordHash: string): Promise<User> {
    return User.create({ email, passwordHash });
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError({ code: 'USER.NOT_FOUND' });
    }

    if (input.email !== undefined) {
      const normalizedEmail = this.normalizeEmail(input.email);

      if (normalizedEmail !== user.email) {
        const existing = await User.findOne({ where: { email: normalizedEmail }, attributes: ['id'] });

        if (existing && existing.id !== user.id) {
          throw new AppError({ code: 'AUTH.EMAIL_ALREADY_REGISTERED' });
        }

        user.email = normalizedEmail;
      }
    }

    if (input.displayName !== undefined) {
      user.displayName = input.displayName;
    }

    if (input.password !== undefined) {
      user.passwordHash = await this.hashPassword(input.password);
    }

    await user.save();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError({ code: 'USER.NOT_FOUND' });
    }

    await user.destroy();
  }

  toResponse(user: User): UserResponse {
    const json = user.toJSON() as UserAttributes;

    return {
      id: json.id,
      email: json.email,
      displayName: json.displayName ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  private normalizeEmail(email: string): string {
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
    const rounds = saltRoundsEnv ? Number.parseInt(saltRoundsEnv, 10) : 10;

    if (!Number.isInteger(rounds) || rounds < 4) {
      throw new AppError({ code: 'SYSTEM.INVALID_CONFIG', message: 'Invalid bcrypt salt rounds configuration' });
    }

    return bcrypt.hash(password, rounds);
  }
}

export const userService = new UserService();
