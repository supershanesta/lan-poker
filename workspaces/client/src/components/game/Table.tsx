import Board from "./Board";
import { useLobbyContext } from '@hooks/useLobbyContext';
import { LoadingOverlay, Overlay } from '@mantine/core';
import { Player as PlayerType } from "@memory-cards/shared/common/types";
import Player from "./Player";
import MyPlayer from "./MyPlayer";
import { useCallback } from "react";

export default function Table() {

  const { lobbyState, me, myIndex } = useLobbyContext();
  console.log(lobbyState);

  

  let orderedPlayers: Array<PlayerType> = [];
  if (lobbyState?.players) {
    orderedPlayers = [...lobbyState.players]
    while (orderedPlayers.findIndex(player => player.id === me.id) !== 0) {
      const first = orderedPlayers.pop();
      if (first) {
        orderedPlayers.unshift(first);
      }
    }

    orderedPlayers.shift();
  }

  const getPlayer = (position: number): PlayerType | null => {
    return orderedPlayers.length >= position ? orderedPlayers[position - 1] : null
  };

  console.log(orderedPlayers);


  return (
    <div id="table" className="relative rounded-[200px] bg-slate-700 py-10 px-5">
      {lobbyState?.hasFinished && <Overlay className="rounded-[200px]" opacity={0.6} color="#000" blur={2} zIndex={5}/>}
      <LoadingOverlay className="rounded-[200px]" visible={!lobbyState?.hasStarted || lobbyState?.isSuspended}/>
      <div className="grid grid-cols-4 gap-4">
        <Player className="place-self-end mt-20" player={getPlayer(3)}/>
        <Player className="place-self-center mt-20" player={getPlayer(4)}/>
        <Player className="place-self-center mt-20" player={getPlayer(5)}/>
        <Player className="place-self-start mt-20" player={getPlayer(6)}/>

        <Player className="place-self-end self-center" player={getPlayer(2)}/>
        <div className="col-span-2">
          <Board/>
        </div>
        <Player className="place-self-start self-center" player={getPlayer(7)}/>

        <Player className="place-self-end self-start" player={getPlayer(1)}/>
        <div className="col-span-2 place-self-center">
          <MyPlayer className=" self-center" player={me}/>
        </div>
        <Player className="place-self-start self-start" player={getPlayer(8)}/>
      </div>
    </div>
  );
}