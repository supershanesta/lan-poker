import { Lobby } from '@app/game/lobby/lobby';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { LOBBY_MAX_LIFETIME } from '@app/game/constants';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { LobbyMode } from '@app/game/lobby/types';
import { Cron } from '@nestjs/schedule';

export class LobbyManager {
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

  public initializeSocket(client: AuthenticatedSocket): void {
    const lobby = this.getPlayerLobby(client);
    if (!lobby) {
      client.data.lobby = null;
    } else {
      lobby.rejoinClient(client);
    }
  }

  public terminateSocket(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  public createLobby(mode: LobbyMode, playerTimer: number, startingBalance: number): Lobby {
    let maxClients = 2;

    switch (mode) {
      case 'solo':
        maxClients = 1;
        break;

      case 'duo':
        maxClients = 9;
        break;
    }

    const lobby = new Lobby(this.server, maxClients, startingBalance);

    lobby.instance.playerTimer = playerTimer;

    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }

  public joinLobby(lobbyId: string, client: AuthenticatedSocket, userName: string): void {
    const lobby = this.lobbies.get(lobbyId);
    console.log(this.lobbies, lobbyId, userName);
    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    if (lobby.clients.size >= lobby.maxClients) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby already full');
    }

    lobby.addClient(client, userName);
  }

  // Periodically clean up lobbies
  @Cron('*/55 * * * *')
  private lobbiesCleaner(): void {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = new Date().getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
          color: 'blue',
          message: 'Game timed out',
        });

        lobby.instance.triggerFinish();

        this.lobbies.delete(lobby.id);
      }
    }
  }

  private getPlayerLobby(client: AuthenticatedSocket): Lobby | undefined {
    const playerId = typeof client.handshake.query.id == 'string' ? parseInt(client.handshake.query.id) : null;
    let lobbyId: string | null = null;
    let lobby;
    if (playerId) {
      this.lobbies.forEach((lobby, id) => {
        const player = lobby.instance.players.getPlayer(playerId);
        if (player) {
          lobbyId = id;
        }
      });
    }
    if (lobbyId && playerId) {
      lobby = this.lobbies.get(lobbyId);
    }
    return lobby;
  }
}
