import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | undefined>;
  create(email: string, passwordHash: string): Promise<User>;
}
