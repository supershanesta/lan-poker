import { Lobby } from '@app/game/lobby/lobby';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Actions, Phase as PhaseType, phaseOrder, Winner } from '@app/../../shared/common/types';
import { Deck } from './deck';
import { Players } from './players';
import { Player } from './player';
import { Phase } from './phase';
import { PokerWinner } from '../types';
import { getWinner } from '../pokerCalcs';

export class Instance {
  public hasStarted = false;

  public hasFinished = false;

  public isSuspended = false;

  public currentRound = 1;

  public timer: any = {};

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
      this.triggerRestart();
    }
    this.dealPlayerCards();
    this.hasStarted = true;
    this.hasFinished = false;
    this.players.setPlayersActive();
    this.setBlindsAndStart();
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Game started !',
    });
  }

  private triggerRestart(): void {
    this.pot = 0;
    this.deck.reset();
    this.phase.reset();
    this.players.reset();
    this.players.offset();
  }

  public playerAction(player: Player, action: Actions, bet: number): void {
    this.setPlayersBet(player, action, bet);
    this.nextPlayerTurn();
  }

  private setPlayersBet(player: Player, action: Actions, bet: number): void {
    const calcBet = this.getBet(player, action, bet);
    this.phase.setBet(calcBet, player.state.bets.phase, action);
    player.setAction({ action, bet: calcBet });
  }

  public startTurn(player: Player | null) {
    if (player) {
      player?.startTurn();
      this.startTimer(player);
    }
  }

  public startTimer(player: Player | null) {
    if (typeof this.timer !== 'undefined') {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
        color: 'red',
        message: 'Player took too long',
      });
      player?.setAction({ action: Actions.fold, bet: 0 });
      this.nextPlayerTurn();
      this.lobby.dispatchLobbyState();
    }, this.playerTimer * 1000);
  }

  public endTimer() {
    if (typeof this.timer !== 'undefined') {
      clearTimeout(this.timer);
    }
  }

  public triggerFinish(): void {
    if (this.hasFinished) {
      return;
    }
    this.hasFinished = true;
  }

  private nextPhase(): void {
    console.log(this.pot, this.phase.state.pot);
    this.pot += this.phase.state.pot;
    if (this.phase.nextPhase() === true) {
      this.players.nextPhase();

      this.detailTableCards(this.phase.getDealCardAmount());
    } else {
      this.determineWinner();
    }
  }

  private nextPlayerTurn(): void {
    const activePlayers = this.players.getActivePlayers();
    if (activePlayers.length === 1) {
      activePlayers[0].setWon('Last Standing!');
      activePlayers[0].addBalance(this.pot + this.phase.state.pot);
      this.triggerFinish();
      return;
    }
    // get currentPlayers Turn
    const player = this.players.getCurrentPlayer();
    // set turn to false
    player?.endTurn();
    // if there is another play who has not gone make it their turn
    const nextPlayer = player?.getNextPlayer();
    console.log(this.players.betsResolved(this.phase.state) && this.players.rotations === 1);
    if (nextPlayer && !(this.players.betsResolved(this.phase.state) && this.players.rotations === 1)) {
      this.startTurn(nextPlayer);
      //if there is not another player but active players do not have the same bet total for the phase, we need to continue
    } else {
      this.players.rotations = 1;
      if (this.players.betsResolved(this.phase.state)) {
        console.log('going to next phase');
        this.nextPhase();
      }
      this.startTurn(this.players.getFirstPlayer());
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
        calcBet = Math.max(bet, this.phase.state.currentPhaseBet);
        break;
      case Actions.raise:
        calcBet = this.phase.state.currentPhaseBet - player.state.bets.phase + bet;
        break;
      default:
        break;
    }
    return calcBet;
  }

  private determineWinner(): void {
    const pokerPlayers = this.getActivePlayersCards();
    const winners = getWinner(pokerPlayers);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore: Unreachable code error
    winners.forEach((winner) => {
      const player = this.players.getPlayer(winner.id);
      player?.setWon(winner.description);
      player?.addBalance(this.pot / winners.length);
    });
    this.triggerFinish();
    this.lobby.dispatchLobbyState();
  }

  private getActivePlayersCards(): PokerWinner[] {
    const tableCards = this.deck.getPublicCards();
    const activePlayers = this.players.getActivePlayers();
    const pokerPlayers = activePlayers.map((player) => ({
      id: player.state.id,
      cards: [...this.deck.getPlayerCards(player.state.id).map((c) => c.card), ...tableCards.map((c) => c.card)],
    }));
    return pokerPlayers;
  }

  private setBlindsAndStart(): void {
    const activePlayers = this.players.getActivePlayers();
    if (activePlayers.length > 2) {
      // set BB to 2nd player
      const player2 = this.players.getActivePlayerByPosition(2);
      if (player2) {
        this.setPlayersBet(player2, Actions.bet, 5);
      }
      // set SM to 3rd player
      const player3 = this.players.getActivePlayerByPosition(3);
      if (player3) {
        this.setPlayersBet(player3, Actions.bet, 10);
      }
      // set turn to next player
      if (activePlayers.length > 3) {
        this.startTurn(this.players.getActivePlayerByPosition(4));
      } else {
        this.startTurn(this.players.getFirstPlayer());
      }
    } else {
      // set BB to 2nd player
      const player2 = this.players.getActivePlayerByPosition(2);
      if (player2) {
        this.setPlayersBet(player2, Actions.bet, 10);
      }
      // set SM to 1st player
      const player1 = this.players.getActivePlayerByPosition(1);
      if (player1) {
        this.setPlayersBet(player1, Actions.bet, 5);
      }
      // set first player turn
      this.startTurn(this.players.getFirstPlayer());
    }
  }
}
