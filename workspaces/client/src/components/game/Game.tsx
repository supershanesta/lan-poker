import { ClientEvents } from '@memory-cards/shared/client/ClientEvents';
import { useLobbyContext } from '@hooks/useGameContext';
import Card from '@components/game/Card';
import { Badge, LoadingOverlay, Overlay } from '@mantine/core';
import { MantineColor } from '@mantine/styles';
import { showNotification } from '@mantine/notifications';
import { emitEvent } from '@utils/analytics';
import Actions from './Actions';

export default function Game() {
  const {sm, lobbyState, me} = useLobbyContext();


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
        <Badge size="xl">{me?.name}</Badge>
        <Badge variant="outline">
          {!lobbyState?.hasStarted
            ? (<span>Waiting for opponent...</span>)
            : (<span>Round {lobbyState.currentRound}</span>)
          }
        </Badge>

        {lobbyState?.mode === 'duo' && <Badge size="xl" color="red">Opponent score</Badge>}
      </div>

      {lobbyState?.isSuspended && (
        <div className="text-center text-lg">
          Next round starting soon, remember cards !
        </div>
      )}

      <div className="grid grid-cols-6 gap-4 relative select-none">
        {lobbyState?.hasFinished && <Overlay opacity={0.6} color="#000" blur={2} zIndex={5}/>}
        <LoadingOverlay visible={!lobbyState?.hasStarted || lobbyState?.isSuspended}/>
          <div
            key={-1}
            className="col-span-1"
          >
            <Card
              card={{ card: null, owner: null }}
              cardIndex={-1}
              onRevealCard={onRevealCard}
              clientId={me.id}
            />
          </div>
        {lobbyState?.cards.filter(card => card.owner === 0).map((card, i) => (
          <div
            key={i}
            className="col-span-1"
          >
            <Card
              card={card}
              cardIndex={i}
              onRevealCard={onRevealCard}
              clientId={me.id}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row relative select-none w-100 justify-center gap-4">
      {lobbyState?.hasFinished && <Overlay opacity={0.6} color="#000" blur={2} zIndex={5}/>}
      {lobbyState?.cards.filter(card => card.owner === me.id).map((card, i) => (
          <div
            key={i}
            className="col-span-1"
          >
            <Card
              card={card}
              cardIndex={i}
              onRevealCard={onRevealCard}
              clientId={me.id}
            />
          </div>
        ))}
      </div>
     {me.turn && (
      <Actions/>
     )}
     {lobbyState?.hasFinished && (
        <div className="text-center mt-5 flex flex-col">
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