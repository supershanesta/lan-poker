import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
import { Cards } from '@shared/common/Cards';

export class LobbyCreateDto {
  @IsString()
  mode: 'solo' | 'duo';

  @IsInt()
  @Min(15)
  @Max(60)
  playerTimer: number;

  @IsString()
  username: string;
}

export class LobbyJoinDto {
  @IsString()
  lobbyId: string;

  @IsString()
  userName: string;
}

export class RevealCardDto {
  @IsNumber()
  cardIndex: Cards;
}
