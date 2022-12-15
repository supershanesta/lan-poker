import { Player as PlayerType } from "@memory-cards/shared/common/types";
import Actions from "./Actions";
 
type props = {
    player: PlayerType | null
    className: string
}

export default function MyPlayer({ player, className }: props) {

  return (
    <div className={`my-player ${player?.turn ? 'player-turn' : ''} ${className}`}>
      <div>
        {player?.name}
      </div>
      <div>
        ${player?.balance || 0}
      </div>
      <div>{player?.action?.action}</div>
    </div>
  );
}