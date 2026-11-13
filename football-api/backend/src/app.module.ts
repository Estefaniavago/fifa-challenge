// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './config/sequelize.config';
import {  PlayersModule } from './modules/players/players.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot(sequelizeConfig),
    PlayersModule,
    AuthModule
  ],
  controllers: [],
  providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
],
})
export class AppModule {
  constructor() {
    console.log('Sequelize config loaded:', sequelizeConfig.models);
  }
}
