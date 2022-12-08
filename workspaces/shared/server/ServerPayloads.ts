import { ServerEvents } from "./ServerEvents";
import { CardInstance, Player } from "../common/types";

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    mode: "solo" | "duo";
    players: Array<Player>;
    playerTimer: number;
    hasStarted: boolean;
    hasFinished: boolean;
    currentRound: number;
    playersCount: number;
    cards: CardInstance[];
    isSuspended: boolean;
  };

  [ServerEvents.GameMessage]: {
    message: string;
    color?: "green" | "red" | "blue" | "orange";
  };
};
