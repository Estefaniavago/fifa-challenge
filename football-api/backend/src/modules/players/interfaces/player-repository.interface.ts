
import { Player } from '../entities/player.entity';

export interface PlayerFilters {
  page: number;
  limit: number;
  name?: string;
  club?: string;
  position?: string;
}

export interface PaginatedPlayers {
  data: Player[];
  total: number;
}

export interface IPlayerRepository {
  findAll(filters: PlayerFilters): Promise<PaginatedPlayers>;
  findOneById(id: number): Promise<Player | undefined>;
  create(data: CreatePlayerData): Promise<Player>;
}

export interface CreatePlayerData {
  fifaVersion: string;
  fifaUpdate: string;
  playerFaceUrl: string;
  longName: string;
  playerPositions: string;
  overall: number;
  potential: number;
  age: number;
  clubName?: string;
  nationalityName?: string;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
}