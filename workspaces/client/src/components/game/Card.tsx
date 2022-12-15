import Image from 'next/image';
import { CardInstance } from '@memory-cards/shared/common/types';
import { CardsMap } from '@icons/new-cards/CardsMap';

type Props = {
  card: CardInstance;
  cardIndex: number | null;
  clientId: number;
};

export default function Card({card, cardIndex, clientId}: Props) {
  let cardBg = 'bg-white/10';

  if (card.owner) {
    cardBg = card.owner === clientId ? 'bg-blue-300/50' : 'bg-red-300/50';
  }

  console.log(card)

  return (
    <div
      className={`transition flex ${cardBg}`}
    >
      <Image
        src={CardsMap(card.card)}
        alt='card'
        className={`
          transition
          hover:scale-[0.85]
          ${card.card === null ? 'cursor-pointer' : ''}
        `}
      />
    </div>
  );
}