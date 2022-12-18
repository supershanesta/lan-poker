import { Actions } from '@app/../../shared/common/types';
import { Player } from '@app/game/instance/player';
import { playerTypeFactory } from './player.data';

describe('Player Class', () => {
  describe('Setup', () => {
    const player = new Player(playerTypeFactory());
    it('it has no bets', async () => {
      expect(player.state.bets).toStrictEqual({ phase: 0, total: 0 });
    });
  });

  describe('Functions', () => {
    const player = new Player(playerTypeFactory());

    it('has been set to won', async () => {
      player.setWon('2 pairs');
      expect(player.state.won).toStrictEqual({ won: true, description: '2 pairs' });
    });

    it('has added balance', async () => {
      player.addBalance(5);
      expect(player.state.balance).toBe(1005);
    });

    it('handles next player', async () => {
      const nextPlayer = new Player(playerTypeFactory());
      player.setNextPlayer(nextPlayer);
      expect(player.getNextPlayer()).toStrictEqual(nextPlayer);
      player.removeNextPlayer();
      expect(player.getNextPlayer()).toBe(null);
    });

    it('ends turn', async () => {
      player.startTurn();
      expect(player.state.turn).toBe(true);
      player.endTurn();
      expect(player.state.turn).toBe(false);
    });
    describe('Actions', () => {
      const player = new Player(playerTypeFactory());
      it('sets bets', async () => {
        player.setAction({ action: Actions.bet, bet: 10 });
        expect(player.state.balance).toBe(990);
        expect(player.state.bets).toStrictEqual({ phase: 10, total: 10 });

        player.setAction({ action: Actions.bet, bet: 10 });
        expect(player.state.balance).toBe(980);
        expect(player.state.bets).toStrictEqual({ phase: 20, total: 20 });

        player.setAction({ action: Actions.raise, bet: 10 });
        expect(player.state.balance).toBe(970);
        expect(player.state.bets).toStrictEqual({ phase: 30, total: 30 });

        player.setAction({ action: Actions.call, bet: 5 });
        expect(player.state.balance).toBe(965);
        expect(player.state.bets).toStrictEqual({ phase: 35, total: 35 });
      });

      it('handle check properly', async () => {
        player.setAction({ action: Actions.check, bet: 10 });
        expect(player.state.balance).toBe(965);
        expect(player.state.bets).toStrictEqual({ phase: 35, total: 35 });
      });

      it('handle fold properly', async () => {
        player.setAction({ action: Actions.fold, bet: 10 });
        expect(player.state.balance).toBe(965);
        expect(player.state.bets).toStrictEqual({ phase: 35, total: 35 });
        expect(player.state.active).toBe(false);
      });
    });
  });
});
