import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { IUserRepository } from '../../interfaces/user-repository.interface';
import { User } from '../../entities/user.entity';

@Injectable()
export class SequelizeUserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const model = await this.userModel.findOne({
      where: { email },
    });

    if (!model) {
      return undefined;
    }

    return this.mapToEntity(model);
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const model = await this.userModel.create({
      email,
      passwordHash,
    });

    return this.mapToEntity(model);
  }

  private mapToEntity(model: UserModel): User {
    const user = new User();

    user.id = model.id;
    user.email = model.email;
    user.passwordHash = model.passwordHash;

    return user;
  }
}