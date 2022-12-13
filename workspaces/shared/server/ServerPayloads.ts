import { ServerEvents } from "./ServerEvents";
import { CardInstance, Player, CurrentPhase } from "../common/types";

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    mode: "solo" | "duo";
    players: Array<Player>;
    playerTimer: number;
    hasStarted: boolean;
    hasFinished: boolean;
    phase: CurrentPhase; 
    playersCount: number;
    cards: CardInstance[];
    isSuspended: boolean;
  };

  [ServerEvents.GameMessage]: {
    message: string;
    color?: "green" | "red" | "blue" | "orange";
  };
};
