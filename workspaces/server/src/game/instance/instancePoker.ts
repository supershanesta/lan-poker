import { Lobby } from '@app/game/lobby/lobby';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Actions, Phase as PhaseType, phaseOrder } from '@app/../../shared/common/types';
import { Deck } from './deck';
import { Players } from './players';
import { Player } from './player';
import { Phase } from './phase';

export class Instance {
  public hasStarted = false;

  public hasFinished = false;

  public isSuspended = false;

  public currentRound = 1;

  public deck = new Deck();

  public playerTimer = 30;

  public players = new Players();

  public currentPlayer: Player | null;

  public pot = 0;

  public phase = new Phase({
    phase: PhaseType[phaseOrder[0]],
    phaseNumber: 0,
    currentPhaseBet: 0,
    pot: 0,
  });

  constructor(private readonly lobby: Lobby) {}

  public triggerStart(): void {
    if (this.hasStarted) {
      return;
    }
    this.dealPlayerCards();
    this.hasStarted = true;
    this.players.setPlayersActive();
    this.players.getFirstPlayer().startTurn();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Game started !',
    });
  }

  public playerAction(player: Player, action: Actions, bet: number): void {
    console.log('PLAYER', player);
    player.setAction({ action, bet: this.getBet(player, action, bet) });
    this.phase.setBet(player);
    this.nextPlayerTurn();
    this.lobby.dispatchLobbyState();
  }

  public triggerFinish(): void {
    if (this.hasFinished || !this.hasStarted) {
      return;
    }

    this.hasFinished = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Game finished !',
    });
  }

  private nextPhase(): void {
    console.log(this.phase.state);
    if (this.phase.nextPhase() === true) {
      this.players.nextPhase();
      console.log(this.phase.state.phase, this.phase.getDealCardAmount());
      this.detailTableCards(this.phase.getDealCardAmount());
    }
  }

  private nextPlayerTurn(): void {
    // get currentPlayers Turn
    const player = this.players.getCurrentPlayer();
    // set turn to false
    player?.endTurn();
    // if there is another play who has not gone make it their turn
    if (player?.getNextPlayer()) {
      player.getNextPlayer().startTurn();
      //if there is not another player but active players do not have the same bet total for the phase, we need to continue
    } else {
      if (this.players.betsResolved(this.phase.state)) {
        console.log('going to next phase');
        this.nextPhase();
      }
      this.players.getFirstPlayer().startTurn();
    }
  }

  public dealPlayerCards(): void {
    this.deck.dealCards(this.players.players, 2);
  }

  private detailTableCards(qty: number): void {
    this.deck.dealPublicCards(qty);
  }

  private getBet(player: Player, action: Actions, bet: number): number {
    let calcBet = 0;
    switch (action) {
      case Actions.call:
        calcBet = this.phase.state.currentPhaseBet - player.state.bets.phase;
        break;
      case Actions.bet:
        calcBet = bet;
        break;
      default:
        break;
    }
    return calcBet;
  }
}
