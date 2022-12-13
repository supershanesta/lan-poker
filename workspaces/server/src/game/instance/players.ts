import { Player } from './player';
import { CurrentPhase, Player as PlayerType } from '@app/../../shared/common/types';

export class Players {
  public players: Player[] = [];
  public rotations = 0;

  public addPlayer(player: Player): void {
    if (this.players.length) {
      this.players[this.players.length - 1].setNextPlayer(player);
    }
    this.players.push(player);
  }

  public getActivePlayers(): Player[] {
    // gets active players
    return this.players.filter((p) => p.state.active === true);
  }

  public getCurrentPlayer(): Player | null {
    // gets active players
    const player = this.players.find((p) => p.state.turn === true);
    if (!player) {
      return null;
    }
    return player;
  }

  public getFirstPlayer(): Player {
    return this.players[0];
  }

  public isPlayerInLobby(id: number) {
    return this.players.find((p) => p.state.id === id) ? true : false;
  }

  public getPlayer(id: number): Player | null {
    return this.players.find((p) => p.state.id === id) || null;
  }

  public length(): number {
    return this.players.length;
  }

  public betsResolved(phase: CurrentPhase): boolean {
    const activePlayers = this.getActivePlayers();
    console.log(
      activePlayers.map((p) => p.state.bets.phase),
      phase.currentPhaseBet,
    );
    if (activePlayers.every((p) => p.state.bets.phase === phase.currentPhaseBet)) {
      console.log('returning true');
      return true;
    }
    return false;
  }

  public returnDispatch(): PlayerType[] {
    return this.players.map((p) => p.state);
  }

  public setPlayersActive(): void {
    this.players.forEach((p) => (p.state.active = true));
  }

  public nextPhase(): void {
    this.players.forEach((p) => {
      p.state.bets.phase = 0;
      p.state.action = null;
      p.state.turn = false;
    });
  }
}
