import { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CurrentLobbyState, CurrentMeState } from '@components/game/states';
import { SocketManagerContext } from '@components/websocket/SocketManagerProvider';
import SocketState from '@components/websocket/SocketState';
import { Player } from '@memory-cards/shared/common/types';

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

  const resetMe = () => {
    const defaultMe: Player = {
      id: Date.now(), turn: false, admin: false, socketId: null, lobbyId: null, name: null, balance: 0, active: false, bets: {
        phase: 0,
        total: 0,
      }
    };
    setMeState(defaultMe);
    setLobbyState(null);
  }

  useEffect(() => {
    if (lobbyState) {
      setMeState(lobbyState?.players.find((player) => player.id == me?.id) || me);
    }
   }, [clientId, lobbyState, me, setMeState]);

   const index =  lobbyState?.players.findIndex((player) => player.id == me?.id);
   const myIndex = index !== -1 ? index : 0;
   const raiseAmount = lobbyState?.phase.currentPhaseBet ? lobbyState?.phase.currentPhaseBet - me.bets.phase : 0;
   const mustBet = raiseAmount > 0 ? true : false;

   const actionData = { raiseAmount, mustBet };
  

  return { sm, socket, lobbyState, setLobbyState,  me, myIndex, actionData, setMeState, clientId, resetMe };
}
