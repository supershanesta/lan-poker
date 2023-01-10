import { ClientEvents } from '@memory-cards/shared/client/ClientEvents';
import { useLobbyContext } from '@hooks/useLobbyContext';
import Card from '@components/game/Card';
import { Badge, LoadingOverlay, Overlay } from '@mantine/core';
import { MantineColor } from '@mantine/styles';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import Actions from './Actions';
import Table from './Table';
import Board from './Board';
import PlayersMobile from './PlayersMobile';

export default function GameMobile() {
  const router = useRouter();
  const {sm, lobbyState, me, resetMe} = useLobbyContext();
  console.log(lobbyState);


  const copyLobbyLink = async () => {
    try {
      await navigator.share({ title: 'Join my Poker Lobby!', url: '' });
      console.log("Data was shared successfully");
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const leaveLobby = async () => {
    resetMe();
    await router.push({
      pathname: '/',
      query: {},
    }, undefined, {});
    sm.emit({
      event: ClientEvents.LobbyLeave,
    });
    
  };

  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <div className="text-center mt-5">
          <button className="btn-warning" onClick={leaveLobby}>Leave Lobby</button>
        </div>
      </div>

      {lobbyState?.isSuspended && (
        <div className="text-center text-lg">
          Next round starting soon, remember cards !
        </div>
      )}
      <div className="text-center text-lg">
          Pot: ${(lobbyState?.pot || 0) + (lobbyState?.phase.pot || 0)}
      </div>
      <Board/>
      <PlayersMobile/>
      <Actions/>
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
              clientId={me.id}
            />
          </div>
        ))}
      </div>
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