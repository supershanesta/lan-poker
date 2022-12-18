import { Suites } from '@shared/common/Deck';
import { CardState } from '@app/game/instance/card';

describe('Card Class', () => {
  const card = new CardState({ value: 2, suite: Suites.CLUBS });

  it('is not revealed and has no owner', async () => {
    expect(card.isRevealed).toBe(false);
    expect(card.ownerId).toBe(null);
  });

  it('does not return card if not revealed', async () => {
    expect(card.toDefinition()).toStrictEqual({ card: null, owner: null });
  });

  it('returns card if revealed', async () => {
    card.isRevealed = true;
    expect(card.toDefinition()).toStrictEqual({ card: { value: 2, suite: Suites.CLUBS }, owner: null });
  });

  it('removes owner and revealed if reset', async () => {
    card.ownerId = 0;
    card.reset();
    expect(card.toDefinition()).toStrictEqual({ card: null, owner: null });
    expect(card.isRevealed).toBe(false);
    expect(card.ownerId).toBe(null);
  });
});
