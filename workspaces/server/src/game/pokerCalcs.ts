import { Hand } from 'pokersolver';
import { PokerWinner } from './types';

const pokerSolverCard = new Map([
  [2, '2'],
  [3, '3'],
  [4, '4'],
  [5, '5'],
  [6, '6'],
  [7, '7'],
  [8, '8'],
  [9, '9'],
  [10, 'T'],
  [11, 'J'],
  [12, 'Q'],
  [13, 'K'],
  [14, 'A'],
]);

enum pokerSolverSuite {
  'H' = 'h',
  'S' = 's',
  'D' = 'd',
  'C' = 'c',
}

export type RawWinner = {
  id: number;
  description: string;
};

export const getWinner = (players: PokerWinner[]): RawWinner[] => {
  const playersHands = players.map((player) => {
    const cards = player.cards.map((c) => `${pokerSolverCard.get(c.value)}${pokerSolverSuite[c.suite]}`);
    const hand = Hand.solve(cards);
    hand.id = player.id;
    console.log('HAND', hand);
    return hand;
    //return { id: player.id, ...Hand.solve(cards) };
  });
  const winners = Hand.winners(playersHands);
  return winners.map((winner) => ({ id: winner.id, description: winner.name }));
};
