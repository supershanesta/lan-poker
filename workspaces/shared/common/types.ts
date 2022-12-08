import { Cards } from './Cards';
import { CardType } from './Deck';

export type CardStateDefinition = {
  card: Cards | null;
  owner: string | null;
};

export type CardInstance = {
  card: CardType | null;
  owner: number | null;
};

export type Player = {
  id: number
  turn: boolean
  socketId: string | null
  lobbyId: string | null
  name: string | null
  balance: number | null
  active: boolean
}