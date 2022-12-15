import { ServerEvents } from "./ServerEvents";
import { CardInstance, Player, CurrentPhase, Winner } from "../common/types";

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
    winners?: Winner[]; 
    pot: number;
  };

  [ServerEvents.GameMessage]: {
    message: string;
    color?: "green" | "red" | "blue" | "orange";
  };
};
