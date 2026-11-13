import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';
import { BadRequestException, Query } from '@nestjs/common';
import { PlayerFilters } from './interfaces/player-repository.interface';
import { ApiSecurity, ApiQuery } from '@nestjs/swagger';

@Controller('players')
@ApiSecurity('bearer')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPlayerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlayerDto | undefined> {
    const player = await this.playersService.getPlayerById(id);
    console.log(`Fetching player  ${player}`);
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found.`);
    }

    return new PlayerDto(player);
  }
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'club', required: false, type: String })
  @ApiQuery({ name: 'position', required: false, type: String })
async getPlayers(
  @Query()
  query: {
    page?: string;
    limit?: string;
    name?: string;
    club?: string;
    position?: string;
  },
) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  if (!Number.isInteger(page) || page < 1) {
    throw new BadRequestException('Page must be a positive integer');
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new BadRequestException('Limit must be between 1 and 100');
  }

  const filters: PlayerFilters = {
    page,
    limit,
    name: query.name,
    club: query.club,
    position: query.position,
  };

  const result = await this.playersService.listPlayers(filters);

  return {
    data: result.data.map((player) => new PlayerDto(player)),
    total: result.total,
    page,
    limit,
    totalPages: Math.ceil(result.total / limit),
  };
}
}



