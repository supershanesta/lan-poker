import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
import { Cards } from '@shared/common/Cards';
import { Actions } from '@shared/common/types';

export class LobbyCreateDto {
  @IsString()
  mode: 'solo' | 'duo';

  @IsInt()
  @Min(15)
  @Max(60)
  playerTimer: number;

  @IsString()
  username: string;

  @IsInt()
  startingBalance: number;
}

export class LobbyJoinDto {
  @IsString()
  lobbyId: string;

  @IsString()
  userName: string;
}

export class PlayerActionDto {
  @IsString()
  action: Actions;

  @IsNumber()
  bet: number;
}

export class RevealCardDto {
  @IsNumber()
  cardIndex: Cards;
}
