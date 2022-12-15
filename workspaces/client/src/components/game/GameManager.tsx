import { useLobbyContext } from '@hooks/useLobbyContext';
import {isMobile} from 'react-device-detect';
import { useEffect } from 'react';
import { Listener } from '@components/websocket/types';
import { ServerEvents } from '@memory-cards/shared/server/ServerEvents';
import { ServerPayloads } from '@memory-cards/shared/server/ServerPayloads';
import Introduction from '@components/game/Introduction';
import Game from '@components/game/Game';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import JoinGame from './JoinGame';
import GameMobile from './GameMobile';

export default function GameManager() {
  const router = useRouter();
  const {sm, me, lobbyState, setLobbyState } = useLobbyContext();

  console.log(lobbyState);


  useEffect(() => {
    sm.connect(me?.id || 0);

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
  }, [me?.id, router, setLobbyState, sm]);

  if (lobbyState === null) {
    return <Introduction/>;
  }
  if (!me.lobbyId) {
    return <JoinGame/>;
  }
  if (isMobile) {
    return <GameMobile/>;
  }
  return <Game/>;
}