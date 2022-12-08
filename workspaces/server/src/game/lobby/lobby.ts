import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from '@shared/server/ServerEvents';
import { AuthenticatedSocket } from '@app/game/types';
import { Instance } from '@app/game/instance/instancePoker';
import { ServerPayloads } from '@shared/server/ServerPayloads';

export class Lobby {
  public readonly id: string = v4();

  public readonly createdAt: Date = new Date();

  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();

  public readonly instance: Instance = new Instance(this);

  constructor(private readonly server: Server, public readonly maxClients: number) {}

  public addClient(client: AuthenticatedSocket, userName: string): void {
    const playerId = typeof client.handshake.query.id == 'string' ? parseInt(client.handshake.query.id) : 0;
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;

    console.log('ADD CLIENT:', playerId, this.id);
    this.instance.players.push({
      id: playerId,
      turn: false,
      socketId: client.id,
      lobbyId: client.data.lobby.id,
      name: userName,
      balance: null,
      active: false,
    });
    if (this.clients.size >= this.maxClients) {
      this.instance.triggerStart();
    }

    this.dispatchLobbyState();
  }

  public rejoinClient(client: AuthenticatedSocket, id: number): void {
    const idx = this.instance.players.findIndex((player) => player.id == id);
    if (idx >= 0) {
      console.log('Found player by Id!');
      this.clients.delete(this.instance.players[idx].socketId || '');
      this.clients.set(client.id, client);
      client.join(this.id);
      client.data.lobby = this;
      this.instance.players[idx].socketId = client.id;
      console.log('Players are now:', this.instance.players);
      console.log(this.clients.size, this.maxClients);
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
      players: this.instance.players,
      hasStarted: this.instance.hasStarted,
      hasFinished: this.instance.hasFinished,
      currentRound: this.instance.currentRound,
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
