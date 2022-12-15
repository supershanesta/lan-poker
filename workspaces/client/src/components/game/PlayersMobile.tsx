import Board from "./Board";
import { useLobbyContext } from '@hooks/useLobbyContext';
import { LoadingOverlay, Overlay } from '@mantine/core';
import { Player as PlayerType } from "@memory-cards/shared/common/types";
import Player from "./Player";
import MyPlayer from "./MyPlayer";
import { useCallback } from "react";

export default function PlayersMobile() {

  const { lobbyState, me, myIndex } = useLobbyContext();
  console.log(lobbyState);


  return (
      <div className="grid grid-cols-4 gap-4 p-2">
        {lobbyState?.players.map((player, i) => (
            <Player key={i} className="" player={player}/>
        ))}
    </div>
  );
}