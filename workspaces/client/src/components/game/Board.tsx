import { useLobbyContext } from '@hooks/useLobbyContext';
import Card from './Card';

export default function Table() {
    const { lobbyState, me, sm } = useLobbyContext();


    return (
        <div className="grid grid-cols-6 gap-4 relative rounded-2xl bg-green-900 select-none p-4">
          <div
            key={-1}
            className="col-span-1"
          >
            <Card
              card={{ card: null, owner: null }}
              cardIndex={-1}
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
              clientId={me.id}
            />
          </div>
        ))}
      </div>
    );
  }

