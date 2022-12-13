import { Socket } from 'socket.io';
import { Lobby } from '@app/game/lobby/lobby';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Player } from './instance/player';

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
    me: null | Player;
  };

  emit: <T>(ev: ServerEvents, data: T) => boolean;
};
