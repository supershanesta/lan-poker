import { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CurrentLobbyState, CurrentMeState } from '@components/game/states';
import { SocketManagerContext } from '@components/websocket/SocketManagerProvider';
import SocketState from '@components/websocket/SocketState';

export function useSocketManager() {
  const sm = useContext(SocketManagerContext);
  const socket = useRecoilValue(SocketState);

  return { sm, socket };
}

export function useLobbyContext() {
  const sm = useContext(SocketManagerContext);
  const socket = useRecoilValue(SocketState);
  const clientId = sm.getSocketId()!;
  const [lobbyState, setLobbyState] = useRecoilState(CurrentLobbyState);
  const [me, setMeState] = useRecoilState(CurrentMeState);

  console.log(sm.getSocketId());

  useEffect(() => {
    console.log('Lobby State changed!');
    if (lobbyState) {
      setMeState(lobbyState?.players.find((player) => player.id == me?.id) || me);
    }
   }, [clientId, lobbyState, me, setMeState]);
  

  return { sm, socket, lobbyState, setLobbyState,  me, setMeState, clientId };
}
