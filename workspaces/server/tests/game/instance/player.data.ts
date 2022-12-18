import { Player } from '@app/game/instance/player';
import { Player as PlayerType, PlayerAction, Actions } from '@shared/common/types';
import { faker } from '@faker-js/faker';

const lobbyId = faker.datatype.uuid();

const playerTypeFactory = (): PlayerType => ({
  id: faker.datatype.number(),
  socketId: faker.datatype.uuid(),
  lobbyId: lobbyId,
  turn: false,
  name: faker.name.firstName(),
  balance: 1000,
  bets: {
    phase: 0,
    total: 0,
  },
  active: true,
  admin: false,
});

const playerFactory = (): Player => new Player(playerTypeFactory());

export { playerFactory, playerTypeFactory };
