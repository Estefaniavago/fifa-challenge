
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  fifaVersion: string;

  @IsString()
  @IsNotEmpty()
  fifaUpdate: string;

  @IsString()
  @IsNotEmpty()
  playerFaceUrl: string;

  @IsString()
  @IsNotEmpty()
  longName: string;

  @IsString()
  @IsNotEmpty()
  playerPositions: string;

  @IsInt()
  @Min(0)
  @Max(100)
  overall: number;

  @IsInt()
  @Min(0)
  @Max(100)
  potential: number;

  @IsInt()
  @Min(16)
  age: number;

  @IsOptional()
  @IsString()
  clubName?: string;

  @IsOptional()
  @IsString()
  nationalityName?: string;

  @IsOptional()
  @IsInt()
  pace?: number;

  @IsOptional()
  @IsInt()
  shooting?: number;

  @IsOptional()
  @IsInt()
  passing?: number;

  @IsOptional()
  @IsInt()
  dribbling?: number;
}

