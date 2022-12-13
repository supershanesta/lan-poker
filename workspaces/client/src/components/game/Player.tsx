import { Player as PlayerType } from "@memory-cards/shared/common/types";

type props = {
    player: PlayerType | null
    className: string
}

export default function Player({ player, className }: props) {

  return (
    <div className={`grid grid-cols-1 gap-1 bg-slate-400 w-20 h-20 ${className}`}>
      <div>{player?.name}</div>
      <div>Last Bet: {player?.action?.bet}</div>
      <div>{player?.balance}</div>
    </div>
  );
}