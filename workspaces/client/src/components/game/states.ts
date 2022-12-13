import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { ServerPayloads } from '@memory-cards/shared/server/ServerPayloads';
import { ServerEvents } from '@memory-cards/shared/server/ServerEvents';
import { Player } from '@memory-cards/shared/common/types';

const { persistAtom } = recoilPersist()

export const CurrentLobbyState = atom<ServerPayloads[ServerEvents.LobbyState] | null>({
  key: 'CurrentLobbyState',
  default: null,
});

export const CurrentMeState = atom<Player>({
  key: 'player',
  default: { id: Date.now(), turn: false, admin: false, socketId: null, lobbyId: null, name: null, balance: null, active: false },
  effects_UNSTABLE: [persistAtom],
});