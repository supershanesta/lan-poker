import { Player as PlayerType, PlayerAction, Actions } from '@app/../../shared/common/types';

export class Player {
  public state: PlayerType;
  private nextPlayer: Player;

  constructor(player: PlayerType) {
    this.state = player;
  }

  public setNextPlayer(player: Player) {
    this.nextPlayer = player;
  }

  public getNextPlayer() {
    return this.nextPlayer;
  }

  public updatePlayerSocket(socketId: string) {
    this.state.socketId = socketId;
  }

  public setAdmin(isAdmin: boolean): void {
    this.state.admin = isAdmin;
  }

  public endTurn(): void {
    this.state.turn = false;
  }

  public startTurn(): void {
    this.state.turn = true;
  }

  private addBet(bet: number): void {
    this.state.balance -= bet;
    this.state.bets.phase += bet;
    this.state.bets.total += bet;
  }

  public setAction(action: PlayerAction): void {
    this.state.action = action;
    if (action.action === Actions.call || action.action === Actions.bet) {
      this.addBet(action.bet);
    }
    if (action.action === Actions.fold) {
      this.state.active = false;
    }
  }
}
