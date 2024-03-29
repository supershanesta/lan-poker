import { Divider, Slider } from "@mantine/core";
import { useLobbyContext } from '@hooks/useLobbyContext';
import { ClientEvents } from "@memory-cards/shared/client/ClientEvents";
import { Actions as ActionType } from "@memory-cards/shared/common/types";
import { useState } from "react";

export default function Actions() {
  const { me, lobbyState, sm, actionData } = useLobbyContext();

  const [bet, setBet] = useState(5);

  const onStart = () => {
    sm.emit({
      event: ClientEvents.LobbyStart,
    });
  }

  const onAction = (action: ActionType) => {
    sm.emit({
      event: ClientEvents.PlayerAction,
      data: {
        action,
        bet
      }
    });
  }

  return (
    <div className="mt-4 pb-5">
      <Divider my="md" />
      <div className="flex flex-row relative select-none w-100 justify-center gap-4">
        {me.admin && (!lobbyState?.hasStarted || lobbyState?.hasFinished) && (
           <button className="btn-neutral z-[1000]" onClick={onStart}>
           Start
         </button>
        )}
        {me.turn && !lobbyState?.hasFinished && (
          <div className="w-full">
            <div>
              <Slider
                size="xl"
                radius="lg"
                labelAlwaysOn
                value={bet}
                onChange={setBet}
                step={5}
                min={actionData.mustBet ? actionData.raiseAmount : 5}
                max={me.balance || 0}
              />
            </div>
            <div className="flex gap-3 justify-center">
              {!actionData.mustBet && (
                <button className="btn-neutral"  onClick={() => onAction(ActionType.check)}>
                  Check
                </button>
              )}
              <button className="btn-warning" onClick={() => onAction(ActionType.fold)}>
                Fold
              </button>
              {actionData.mustBet && (
                <button className="btn" onClick={() => onAction(ActionType.call)}>
                  Call
                </button>
              )}
              {actionData.mustBet && (
                <button className="btn" onClick={() => onAction(ActionType.raise)}>
                    Raise
                </button>
              )}
              {!actionData.mustBet && (
              <button className="btn" onClick={() => onAction(ActionType.bet)}>
                Bet
              </button>
              )}
            </div>
          </div>
        )}
        </div>
    </div>
  );
}
