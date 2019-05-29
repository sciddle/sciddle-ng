import {TurnState} from '../turn-state.enum';

/**
 * Represents a turn
 */
export class Turn {

  /** State of the turn */
  state: TurnState;
  /** ID of team taking turn */
  teamID: number;

  /**
   * Constructor
   */
  public constructor() {
    this.state = TurnState.UNINIZIALIZED;
    this.teamID = -1;
  }
}
