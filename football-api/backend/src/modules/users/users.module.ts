import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './repositories/sequelize/user.model';
import { SequelizeUserRepository } from './repositories/sequelize/sequelize-user.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: SequelizeUserRepository,
    },
  ],
  exports: ['IUserRepository'],
})
export class UsersModule {}