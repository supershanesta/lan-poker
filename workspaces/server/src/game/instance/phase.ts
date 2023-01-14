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

  public setBet(bet, phaseBet, action: Actions): void {
    this.state.currentPhaseBet = Math.max(bet + phaseBet, this.state.currentPhaseBet);
    this.setPot(bet);
  }

  private setPot(bet: number): void {
    this.state.pot += bet;
  }

  public reset(): void {
    this.state = {
      phase: PhaseType[phaseOrder[0]],
      phaseNumber: 0,
      currentPhaseBet: 0,
      pot: 0,
    };
  }
}
