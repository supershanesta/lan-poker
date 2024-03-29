import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { Logger, UsePipes } from '@nestjs/common';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { LobbyCreateDto, LobbyJoinDto, PlayerActionDto, RevealCardDto } from '@app/game/dtos';
import { WsValidationPipe } from '@app/websocket/ws.validation-pipe';

@UsePipes(new WsValidationPipe())
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(private readonly lobbyManager: LobbyManager) {}

  afterInit(server: Server): any {
    // Pass server instance to managers
    this.lobbyManager.server = server;

    this.logger.log('Game server initialized !');
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    // Call initializers to set up socket
    this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
    console.log('MY LOBBY', client.data.lobby);
  }

  async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
    // Handle termination of socket
    this.lobbyManager.terminateSocket(client);
  }

  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: AuthenticatedSocket): void {
    client.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  @SubscribeMessage(ClientEvents.LobbyCreate)
  onLobbyCreate(client: AuthenticatedSocket, data: LobbyCreateDto): WsResponse<ServerPayloads[ServerEvents.GameMessage]> {
    const lobby = this.lobbyManager.createLobby(data.mode, data.playerTimer, data.startingBalance);
    lobby.addClient(client, data.username);

    return {
      event: ServerEvents.GameMessage,
      data: {
        color: 'green',
        message: 'Lobby created',
      },
    };
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto): void {
    this.lobbyManager.joinLobby(data.lobbyId, client, data.userName);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(client: AuthenticatedSocket): void {
    console.log('Am I here?');
    console.log(client.data.lobby);
    client.data.lobby?.removeClient(client);
  }

  @SubscribeMessage(ClientEvents.LobbyStart)
  onStart(client: AuthenticatedSocket): void {
    if (!client.data.lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'You are not in a lobby');
    }
    if (!client.data.me?.state.admin) {
      throw new ServerException(SocketExceptions.LobbyError, 'You are not the admin');
    }
    client.data.lobby.instance.triggerStart();
    client.data.lobby.dispatchLobbyState();
  }

  @SubscribeMessage(ClientEvents.PlayerAction)
  onPlayerAction(client: AuthenticatedSocket, data: PlayerActionDto): void {
    if (!client.data.lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'You are not in a lobby');
    }
    if (!client.data.me?.state.turn) {
      throw new ServerException(SocketExceptions.LobbyError, 'It is not your turn');
    }
    client.data.lobby.instance.playerAction(client.data.me, data.action, data.bet);
    client.data.lobby.dispatchLobbyState();
  }
}
