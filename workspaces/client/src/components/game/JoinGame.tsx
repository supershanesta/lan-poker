import { useLobbyContext } from "@hooks/useLobbyContext";
import { ClientEvents } from "@memory-cards/shared/client/ClientEvents";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
      <h2 className="text-2xl">Are you ready to beat your friends 👋</h2>

      <p className="mt-3 text-lg">
        A simple online poker game that allows you and your friends to create your own lobby, set your own rules, and destory your friendships with banter and trickery.
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
