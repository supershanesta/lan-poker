import { useLobbyContext } from '@hooks/useGameContext';
import { useEffect } from 'react';
import { Listener } from '@components/websocket/types';
import { ServerEvents } from '@memory-cards/shared/server/ServerEvents';
import { ServerPayloads } from '@memory-cards/shared/server/ServerPayloads';
import Introduction from '@components/game/Introduction';
import Game from '@components/game/Game';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import JoinGame from './JoinGame';

export default function GameManager() {
  const router = useRouter();
  const {sm, me, setMeState, clientId, lobbyState, setLobbyState } = useLobbyContext();

  console.log('DATA', me, lobbyState, clientId);

  useEffect(() => {
    sm.connect(me?.id || 0);

    console.log('Checking for lobby state change')

    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = async (data) => {
      setLobbyState(data);

      router.query.lobby = data.lobbyId;

      await router.push({
        pathname: '/',
        query: {...router.query},
      }, undefined, {});
    };

    const onGameMessage: Listener<ServerPayloads[ServerEvents.GameMessage]> = ({color, message}) => {
      showNotification({
        message: message,
        color: color,
        autoClose: 2000,
      });
    };

    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    sm.registerListener(ServerEvents.GameMessage, onGameMessage);

    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.GameMessage, onGameMessage);
    };
  }, [router, setLobbyState, sm]);

  if (lobbyState === null) {
    return <Introduction/>;
  }
  if (!me.lobbyId) {
    return <JoinGame/>;
  }

  return <Game/>;
}