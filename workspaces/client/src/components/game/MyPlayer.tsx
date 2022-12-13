import { Player as PlayerType } from "@memory-cards/shared/common/types";
import Actions from "./Actions";
 
type props = {
    player: PlayerType | null
    className: string
}

export default function MyPlayer({ player, className }: props) {

  return (
    <div className="grid grid-cols-1">
      <div className={`bg-slate-400 w-40 h-40 place-self-center ${className}`}>
        {player?.name}
        {player?.balance}
      </div>
      <Actions/>
    </div>
  );
}