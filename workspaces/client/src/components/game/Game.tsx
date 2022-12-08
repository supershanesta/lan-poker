import { ClientEvents } from '@memory-cards/shared/client/ClientEvents';
import { useLobbyContext } from '@hooks/useGameContext';
import Card from '@components/game/Card';
import { Badge, LoadingOverlay, Overlay } from '@mantine/core';
import { MantineColor } from '@mantine/styles';
import { showNotification } from '@mantine/notifications';
import { emitEvent } from '@utils/analytics';

export default function Game() {
  const {sm, lobbyState, clientId, me} = useLobbyContext();
  let clientScore = 0;
  let opponentScore = 0;

  for (const scoreId in lobbyState?.scores) {
    if (scoreId === clientId) {
      clientScore = lobbyState?.scores[scoreId] || 0;
    } else {
      opponentScore = lobbyState?.scores[scoreId] || 0;
    }
  }

  // Compute result
  let result: string;
  let resultColor: MantineColor;

  if (clientScore === opponentScore) {
    result = 'Draw, no one won!';
    resultColor = 'yellow';
  } else if (clientScore > opponentScore) {
    result = 'You won!';
    resultColor = 'blue';
  } else {
    result = 'You lost...';
    resultColor = 'red';
  }

  const onRevealCard = (cardIndex: number) => {
    sm.emit({
      event: ClientEvents.GameRevealCard,
      data: {cardIndex},
    });

    emitEvent('card_revealed');
  };

/*  const onReplay = () => {
    sm.emit({
      event: ClientEvents.LobbyCreate,
      data: {
        mode: lobbyState?.mode,
        delayBetweenRounds: lobbyState?.delayBetweenRounds,
      },
    });

    emitEvent('lobby_create');
  };

*/

  const copyLobbyLink = async () => {
    const link = `${window.location.origin}?lobby=${lobbyState?.lobbyId}`;
    await navigator.clipboard.writeText(link);

    showNotification({
      message: 'Link copied to clipboard!',
      color: 'green',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <Badge size="xl">{me?.name}: {clientScore}</Badge>
        <Badge variant="outline">
          {!lobbyState?.hasStarted
            ? (<span>Waiting for opponent...</span>)
            : (<span>Round {lobbyState.currentRound}</span>)
          }
        </Badge>

        {lobbyState?.mode === 'duo' && <Badge size="xl" color="red">Opponent score: {opponentScore}</Badge>}
      </div>

      {lobbyState?.isSuspended && (
        <div className="text-center text-lg">
          Next round starting soon, remember cards !
        </div>
      )}

      <div className="grid grid-cols-7 gap-4 relative select-none">
        {lobbyState?.hasFinished && <Overlay opacity={0.6} color="#000" blur={2} zIndex={5}/>}
        <LoadingOverlay visible={!lobbyState?.hasStarted || lobbyState?.isSuspended}/>

        {lobbyState?.cards.map((card, i) => (
          <div
            key={i}
            className="col-span-1"
          >
            <Card
              card={card}
              cardIndex={i}
              onRevealCard={onRevealCard}
              clientId={clientId}
            />
          </div>
        ))}
      </div>

     {lobbyState?.hasFinished && (
        <div className="text-center mt-5 flex flex-col">
          <Badge size="xl" color={resultColor} className="self-center">{result}</Badge>
          <button className="mt-3 self-center" onClick={() => {console.log('testing')}}>Play again ?</button>
        </div>
      )}

      {!lobbyState?.hasStarted && (
        <div className="text-center mt-5">
          <button className="btn" onClick={copyLobbyLink}>Copy lobby link</button>
        </div>
      )}
    </div>
  );
}