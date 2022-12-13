import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from '@shared/server/ServerEvents';
import { AuthenticatedSocket } from '@app/game/types';
import { Instance } from '@app/game/instance/instancePoker';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { Player } from '../instance/player';

export class Lobby {
  public readonly id: string = v4();

  public readonly createdAt: Date = new Date();

  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();

  public readonly instance: Instance = new Instance(this);

  constructor(private readonly server: Server, public readonly maxClients: number, public readonly startingBalance: number) {}

  public addClient(client: AuthenticatedSocket, userName: string): void {
    const playerId = typeof client.handshake.query.id == 'string' ? parseInt(client.handshake.query.id) : 0;
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;
    const player = {
      id: playerId,
      turn: false,
      socketId: client.id,
      lobbyId: client.data.lobby.id,
      name: userName,
      balance: this.startingBalance,
      bets: {
        phase: 0,
        total: 0,
      },
      active: false,
      admin: this.instance.players.length() ? false : true,
    };
    client.data.me = new Player(player);
    this.instance.players.addPlayer(client.data.me);

    this.dispatchLobbyState();
  }

  public rejoinClient(client: AuthenticatedSocket): void {
    const playerId = typeof client.handshake.query.id == 'string' ? parseInt(client.handshake.query.id) : null;
    const player = this.instance.players.getPlayer(playerId || 0);
    if (player) {
      this.clients.delete(player.state.socketId || '');
      this.clients.set(client.id, client);
      client.join(this.id);
      client.data.lobby = this;
      player.updatePlayerSocket(client.id);
      client.data.me = player;
      if (this.clients.size >= this.maxClients) {
        this.instance.triggerStart();
      }
      this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
        color: 'blue',
        message: 'Opponent Rejoined lobby',
      });
      this.dispatchLobbyState();
    }
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;

    // If player leave then the game isn't worth to play anymore
    //this.instance.triggerFinish();

    // Alert the remaining player that client left lobby
    this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Opponent left lobby',
    });

    this.dispatchLobbyState();
  }

  public dispatchLobbyState(): void {
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      mode: this.maxClients === 1 ? 'solo' : 'duo',
      playerTimer: this.instance.playerTimer,
      players: this.instance.players.returnDispatch(),
      hasStarted: this.instance.hasStarted,
      hasFinished: this.instance.hasFinished,
      phase: this.instance.phase.state,
      playersCount: this.clients.size,
      cards: this.instance.deck.cards.map((card) => card.toDefinition()),
      isSuspended: this.instance.isSuspended,
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}
