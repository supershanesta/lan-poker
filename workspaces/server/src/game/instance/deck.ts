import { Suites, standardCards } from '@shared/common/Deck';
import { CardState } from '@app/game/instance/card';
import { Player } from '@app/../../shared/common/types';

export class Deck {
  public cards: CardState[] = [];
  public top = 0;

  constructor() {
    this.initializeCards();
  }

  public dealCards(players: Player[], qty: number): void {
    const cards: CardState[] = [];
    players.forEach((player) => {
      for (let i = 0; i < qty; i++) {
        this.cards[this.top + i].ownerId = player.id;
        this.cards[this.top + i].isRevealed = true;
        cards.push(this.cards[this.top + i]);
      }
      this.top += qty;
    });
  }

  public dealPublicCards(qty: number): void {
    const cards: CardState[] = [];
    for (let i = 0; i < qty; i++) {
      this.cards[this.top + i].ownerId = 0;
      this.cards[this.top + i].isRevealed = true;
      cards.push(this.cards[this.top + i]);
    }
    this.top += qty;
  }

  private initializeCards(): void {
    Object.keys(Suites).forEach((suite) => {
      standardCards.forEach((value) => this.cards.push(new CardState({ value, suite: Suites[suite] })));
    });

    // Shuffle array randomly
    this.cards = this.cards.sort((a, b) => 0.5 - Math.random());
  }
}
