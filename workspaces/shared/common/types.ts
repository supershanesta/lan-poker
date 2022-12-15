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

export enum Actions {
  bet = 'bet',
  check = 'check',
  fold = 'fold',
  call = 'call',
  raise = 'raise',
}

export enum Phase {
  preflop = 'preflop',
  flop = 'flop',
  turn = 'turn',
  river = 'river'
}

export enum phaseOrder {
  preflop,
  flop,
  turn,
  river,
}

export enum phaseCards {
  preflop = 0,
  flop = 3,
  turn = 1,
  river = 1
}

export type PlayerAction = {
  action: Actions
  bet: number
}

export type PlayerBets = {
  phase: number
  total: number
}

export type Winner = {
  won: boolean,
  description: string;
}

export type Player = {
  id: number
  socketId: string | null
  lobbyId: string | null
  turn: boolean
  name: string | null
  balance: number
  action?: PlayerAction | null
  won?: Winner
  bets: PlayerBets
  active: boolean
  admin: boolean
}

export type CurrentPhase = {
  phase: Phase
  phaseNumber: phaseOrder
  currentPhaseBet: number
  pot: number
}