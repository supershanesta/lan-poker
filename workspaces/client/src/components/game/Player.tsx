import { Badge } from "@mantine/core";
import { Actions, Player as PlayerType } from "@memory-cards/shared/common/types";
import {isMobile} from 'react-device-detect';
import { useLobbyContext } from '@hooks/useLobbyContext';
import Card from "./Card";

type props = {
    player: PlayerType | null
    className: string
}

export default function Player({ player, className }: props) {
  const { lobbyState } = useLobbyContext();
  let message = null;
  let bet = null;
  if (player?.won?.won) {
    message = player?.won?.description;
  } else if (player?.action?.action) {
    message = player?.action?.action;
  };

  if (player?.action?.action === Actions.call || player?.action?.action === Actions.bet || player?.action?.action === Actions.raise) {
    bet = ` $${player?.bets.phase}`;
  }

  

  if (isMobile) {
    return(
    <div className={'grid col-1 gap-2 justify-items-center content-start'}>
      <div className={`player justify-items-center ${player?.id ? 'visible' : 'invisible'} ${player?.won?.won ? 'winner' : ''} ${player?.turn ? 'player-turn' : ''}  ${className}`}>
        <div>
          {player?.name}
        </div>
        <div>
          ${player?.balance || 0}
        </div>
        <div>
        </div>
      </div>
      {message && (
      <Badge className={'justify-self-center'} size="lg">
        {message}{bet}
      </Badge>)}
      {lobbyState?.hasFinished && player?.active && (
      <div className="flex grid-col-2 gap-1">
        {lobbyState?.cards.filter(card => card.owner === player?.id).map((card, i) => (
            <div
              key={i}
              className="col-span-1"
            >
              <Card
                card={card}
                cardIndex={i}
                clientId={player?.id || 0}
              />
            </div>
          ))}
      </div>
      )}
    </div>
    );
  }
  return (
    <div className={`player ${player?.id ? 'visible' : 'invisible'} ${player?.won?.won ? 'winner' : ''} ${player?.turn ? 'player-turn' : ''}  ${className}`}>
      <div className="flex flex-row justify-between">
        <div>
          {player?.name}
        </div>
        <div>
          ${player?.balance || 0}
        </div>
      </div>
      <div>Last Bet: ${player?.action?.bet || 0}</div>
    </div>
  );
}