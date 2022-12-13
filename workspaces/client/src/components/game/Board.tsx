import { ClientEvents } from '@memory-cards/shared/client/ClientEvents';
import { emitEvent } from '@utils/analytics';
import { useLobbyContext } from '@hooks/useLobbyContext';
import Card from './Card';

export default function Table() {
    const { lobbyState, me, sm } = useLobbyContext();

    const onRevealCard = (cardIndex: number) => {
        sm.emit({
          event: ClientEvents.GameRevealCard,
          data: {cardIndex},
        });
    
        emitEvent('card_revealed');
      };


    return (
        <div className="grid grid-cols-6 gap-4 relative rounded-2xl bg-green-900 select-none p-4">
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
    );
  }

