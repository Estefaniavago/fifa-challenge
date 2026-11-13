
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlayerModel } from './player.model';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';
import { Op } from 'sequelize';
import {
  PlayerFilters,
  PaginatedPlayers,
} from '../../interfaces/player-repository.interface';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class SequelizePlayerRepository implements IPlayerRepository {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerModel: typeof PlayerModel,
  ) {}

 async findAll(filters: PlayerFilters): Promise<PaginatedPlayers> {
  const { page, limit, name, club, position } = filters;

  const where: any = {};

  if (name) {
    where.longName = { [Op.like]: `%${name}%` };
  }

  if (club) {
    where.clubName = { [Op.like]: `%${club}%` };
  }

  if (position) {
    where.playerPositions = { [Op.like]: `%${position}%` };
  }

  const { rows, count } = await this.playerModel.findAndCountAll({
    where,
    limit,
    offset: (page - 1) * limit,
    order: [['id', 'ASC']],
  });

  return {
    data: rows.map((player) => this.mapToEntity(player)),
    total: count,
  };
}

  async findOneById(id: number): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);

    if (!model) {
      return undefined;
    }

    return this.mapToEntity(model);
  }
async create(
  data: CreationAttributes<PlayerModel>,
): Promise<Player> {
  const created = await this.playerModel.create(data);

  return this.mapToEntity(created);
}

  private fixMojibake(value: string): string {
    if (!/[ÃÂ]/.test(value)) {
      return value;
    }

    const corrected = Buffer.from(value, 'latin1').toString('utf8');

    return corrected.includes('\uFFFD') ? value : corrected;
  }

  private mapToEntity(model: PlayerModel): Player {
    if (!model) {
      throw new Error('Attempted to map null model to Player entity');
    }

    const player = new Player();
    player.id = model.id;
    player.name = this.fixMojibake(model.longName);
    player.club = model.clubName || 'Unknown Club';
    player.position = model.playerPositions?.split(',')[0].trim() ?? 'Unknown';
    player.nationality = model.nationalityName || 'Unknown Nationality';
    player.rating = model.overall;

    player.speed = model.dataValues.pace ?? 0;
    player.shooting = model.dataValues.shooting ?? 0;
    player.dribbling = model.dataValues.dribbling ?? 0;
    player.passing = model.dataValues.passing ?? 0;

    return player;
  }
}
