import { useLobbyContext } from "@hooks/useGameContext";
import { ClientEvents } from "@memory-cards/shared/client/ClientEvents";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { emitEvent } from "@utils/analytics";
import { Divider, Select, TextInput } from "@mantine/core";

export default function JoinGame() {
  const router = useRouter();
  const { sm } = useLobbyContext();
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
      <div>
        <h3 className="text-xl">Username</h3>
        <TextInput
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
      </div>
        <button className="btn" onClick={() => onJoinLobby()}>
          Join Lobby
        </button>
    </div>
  );
}
