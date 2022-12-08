import { useLobbyContext } from "@hooks/useGameContext";
import { ClientEvents } from "@memory-cards/shared/client/ClientEvents";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { emitEvent } from "@utils/analytics";
import { Divider, Select, TextInput } from "@mantine/core";

export default function Introduction() {
  const router = useRouter();
  const { sm, clientId, setMeState } = useLobbyContext();
  const [playerTimer, setPlayerTimer] = useState<number>(30);
  const [userName, setUsername] = useState<string>("");

  const onJoinLobby = () => {
    sm.emit({
      event: ClientEvents.LobbyJoin,
      data: {
        userName: userName,
        lobbyId: router.query.lobby,
      },
    });
  }

  const onCreateLobby = (mode: "solo" | "duo") => {
    sm.emit({
      event: ClientEvents.LobbyCreate,
      data: {
        username: userName,
        mode: mode,
        playerTimer: playerTimer,
      },
    });
    setMeState((prev) => ({ ...prev, socketId: clientId, name: userName, balance: null, active: false, lobbyId: null }))
    emitEvent("lobby_create");
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl">Hello ! 👋</h2>

      <p className="mt-3 text-lg">
        Welcome to a simple game to test your memory against other players or
        yourself (solo mode).
        <br />
        Reveal cards by clicking on them, you can reveal two card per round,
        your opponent too.
        <br />
        Once you revealed cards, if they match then you gain a point.
        You&apos;ll also see the cards revealed by your opponent.
        <br />
        Game is over once all cards are revealed. Player with most points wins!
      </p>

      <Divider my="md" />

      {!router.query.lobby && (
        <div>
        <h3 className="text-xl">Game options</h3>

        <Select
          label="Player Timer"
          defaultValue="30"
          onChange={(timer) => setPlayerTimer(+timer!)}
          data={[
            { value: "15", label: "15 seconds" },
            { value: "30", label: "30 seconds" },
            { value: "45", label: "45 seconds" },
            { value: "60", label: "60 seconds" },
          ]}
        />
      </div>
      )}

      <div>
        <h3 className="text-xl">Username</h3>
        <TextInput
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
      </div>

      {!router.query.lobby && (
        <div className="mt-5 text-center flex justify-between">
          <button className="btn" onClick={() => onCreateLobby("solo")}>
            Create solo lobby
          </button>
          <button className="btn" onClick={() => onCreateLobby("duo")}>
            Create duo lobby
          </button>
        </div>
      )}
      {router.query.lobby && (
        <button className="btn" onClick={() => onJoinLobby()}>
          Join Lobby
        </button>
      )}
    </div>
  );
}
