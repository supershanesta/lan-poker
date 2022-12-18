import { Players } from '@app/game/instance/players';
import { playerFactory } from './player.data';

const basePlayers = [playerFactory(), playerFactory(), playerFactory(), playerFactory(), playerFactory()];

describe('Players Class', () => {
  describe('Setup', () => {
    const players = new Players();
    basePlayers.forEach((player, i) => {
      players.addPlayer(player);
    });
    it('puts correct nextPlayers', async () => {
      players.players.forEach((player, i) => {
        expect(player.getNextPlayer()).toStrictEqual(i <= players.players.length ? players.players[i + 1] : null);
      });
    });
    it('has correct amount of players', async () => {
      expect(players.players.length).toBe(basePlayers.length);
    });
  });
});
