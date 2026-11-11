
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { PlayerModel } from '../modules/players/repositories/sequelize/player.model';
dotenv.config({ path: '../.env' });

const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
  },
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  models: [PlayerModel],
  autoLoadModels: true,
  synchronize: false,
  logging: console.log,
};

export default sequelizeConfig;
