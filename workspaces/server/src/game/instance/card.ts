import { CardType } from '@shared/common/Deck';
import { CardInstance } from '@shared/common/types';
import { Player } from '@shared/common/types';

export class CardState {
  constructor(public readonly card: CardType, public isRevealed: boolean = false, public ownerId: Player['id'] | null = null) {}

  public toDefinition(): CardInstance {
    return {
      card: this.isRevealed ? this.card : null,
      owner: this.ownerId,
    };
  }

  public reset(): void {
    this.isRevealed = false;
    this.ownerId = null;
  }
}
