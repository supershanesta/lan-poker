import { phaseOrder, phaseCards, CurrentPhase, Actions, Phase as PhaseType } from '@app/../../shared/common/types';
import { Player } from './player';

export class Phase {
  constructor(public state: CurrentPhase) {}

  public nextPhase(): boolean {
    if (this.state.phaseNumber === 3) {
      return false;
    }
    this.state = {
      phaseNumber: (this.state.phaseNumber + 1) as phaseOrder,
      phase: PhaseType[phaseOrder[this.state.phaseNumber + 1]],
      currentPhaseBet: 0,
      pot: 0,
    };
    return true;
  }

  public getDealCardAmount(): phaseCards {
    return phaseCards[this.state.phase];
  }

  public setBet(player: Player): void {
    if (player.state.action?.action === Actions.bet) {
      this.state.currentPhaseBet = player.state.action?.bet;
      this.setPot(this.state.currentPhaseBet);
    }
  }

  private setPot(bet: number): void {
    this.state.pot += bet;
  }
}
