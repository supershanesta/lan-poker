import { useLobbyContext } from "@hooks/useLobbyContext";
import { ClientEvents } from "@memory-cards/shared/client/ClientEvents";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Divider, Select, TextInput, NumberInput } from "@mantine/core";

export default function Introduction() {
  const router = useRouter();
  const { sm, clientId, setMeState } = useLobbyContext();
  const [playerTimer, setPlayerTimer] = useState<number>(30);
  const [userName, setUsername] = useState<string>("");
  const [startingBalance, setStartingBalance] = useState<number>(1000);

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
        startingBalance: startingBalance,
      },
    });
    setMeState((prev) => ({ ...prev, socketId: clientId, name: userName, balance: 0, active: false, lobbyId: null }))
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl">Are you ready to beat your friends 👋</h2>

      <p className="mt-3 text-lg">
        A simple online poker game that allows you and your friends to create your own lobby, set your own rules, and destroy your friendships with banter and trickery.
      </p>

      <Divider my="md" />

      {!router.query.lobby && (
        <>
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
      
      <div>
        <h3 className="text-xl">Starting Balance</h3>
        <NumberInput
          onChange={(event) => setStartingBalance(event || 0)}
        />
      </div>
      </>
      )}

      <div>
        <h3 className="text-xl">Username</h3>
        <TextInput
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
      </div>

      {!router.query.lobby && (
        <div className="mt-5 text-center flex justify-center">
          <button className="btn" onClick={() => onCreateLobby("duo")}>
            Create lobby
          </button>
        </div>
      )}
      {router.query.lobby && (
        <div className="mt-5 text-center flex justify-center">
          <button className="btn" onClick={() => onJoinLobby()}>
            Join Lobby
          </button>
        </div>
      )}
    </div>
  );
}
