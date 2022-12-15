import { Socket } from 'socket.io';
import { Lobby } from '@app/game/lobby/lobby';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Player } from './instance/player';
import { CardType } from '@app/../../shared/common/Deck';

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
    me: null | Player;
  };

  emit: <T>(ev: ServerEvents, data: T) => boolean;
};

export type PlayerCards = CardType[];

export type PokerWinner = {
  id: number;
  cards: PlayerCards;
};
