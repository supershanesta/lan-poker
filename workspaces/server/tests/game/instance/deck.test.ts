import { Deck } from '@app/game/instance/deck';
import { playerFactory } from './player.data';

describe('Deck Class', () => {
  describe('Setup', () => {
    const deck = new Deck();
    it('has 52 cards', async () => {
      expect(deck.cards.length).toBe(52);
    });

    it('is at the top of the deck', async () => {
      expect(deck.top).toBe(0);
    });
  });

  describe('Dealing Public cards', () => {
    const deck = new Deck();
    const qty = 3;
    deck.dealPublicCards(qty);
    it('deals public card quantity specified', async () => {
      expect(deck.cards.filter((card) => card.ownerId === 0).length).toBe(qty);
    });

    it('sets top after public deal', async () => {
      expect(deck.top).toBe(qty);
    });

    it('still has 52 cards', async () => {
      expect(deck.cards.length).toBe(52);
    });
  });

  describe('Dealing Private cards', () => {
    const deck = new Deck();
    const qty = 2;
    const player1 = playerFactory();
    const player2 = playerFactory();
    const players = [player1, player2];
    deck.dealCards(players, qty);

    it('deals player card quantity specified', async () => {
      expect(deck.cards.filter((card) => card.ownerId === player1.state.id).length).toBe(qty);
      expect(deck.cards.filter((card) => card.ownerId === player2.state.id).length).toBe(qty);
    });

    it('sets top after public deal', async () => {
      expect(deck.top).toBe(players.length * qty);
    });

    it('still has 52 cards', async () => {
      expect(deck.cards.length).toBe(52);
    });
  });

  describe('Get Cards', () => {
    const deck = new Deck();
    const qty = 2;
    const publicQty = 3;
    const player1 = playerFactory();
    const player2 = playerFactory();
    const players = [player1, player2];
    deck.dealCards(players, qty);
    deck.dealPublicCards(publicQty);

    it('gets public cards', async () => {
      expect(deck.getPublicCards().length).toBe(publicQty);
    });
    it('gets player cards', async () => {
      players.forEach((player) => {
        expect(deck.getPlayerCards(player.state.id).length).toBe(qty);
      });
    });
  });

  describe('Reset Deck', () => {
    const deck = new Deck();
    const qty = 2;
    const publicQty = 3;
    const player1 = playerFactory();
    const player2 = playerFactory();
    const players = [player1, player2];
    deck.dealCards(players, qty);
    deck.dealPublicCards(publicQty);
    deck.reset();

    it('has no public cards', async () => {
      expect(deck.getPublicCards.length).toBe(0);
    });
    it('has no player cards', async () => {
      players.forEach((player) => {
        expect(deck.getPlayerCards(player.state.id).length).toBe(0);
      });
    });
    it('sets top to zero', async () => {
      expect(deck.top).toBe(0);
    });
  });
});
