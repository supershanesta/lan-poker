import { Cards } from '@shared/common/Cards';
import { Lobby } from '@app/game/lobby/lobby';
import { CardState } from '@app/game/instance/card-state';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { AuthenticatedSocket } from '@app/game/types';
import { SECOND } from '@app/game/constants';
import { Socket } from 'socket.io';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Player } from '@app/../../shared/common/types';
import { Deck } from './deck';

export class Instance {
  public hasStarted = false;

  public hasFinished = false;

  public isSuspended = false;

  public currentRound = 1;

  public deck = new Deck();

  public playerTimer = 30;

  public players: Array<Player> = [];

  public currentPlayer: Player | null;

  private cardsRevealedForCurrentRound: Record<number, Socket['id']> = {};

  constructor(private readonly lobby: Lobby) {}

  public triggerStart(): void {
    if (this.hasStarted) {
      return;
    }
    this.dealPlayerCards();
    this.hasStarted = true;
    this.players[0].turn = true;
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Game started !',
    });
  }

  public triggerFinish(): void {
    if (this.hasFinished || !this.hasStarted) {
      return;
    }

    this.hasFinished = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Game finished !',
    });
  }

  public dealPlayerCards(): void {
    this.deck.dealCards(this.players, 2);
  }
}
