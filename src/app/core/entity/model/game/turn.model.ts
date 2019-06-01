import {TurnState} from '../turn-state.enum';
import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';

/**
 * Represents a turn
 */
export class Turn extends Entity {

  /** State of the turn */
  state: TurnState;
  /** ID of team taking turn */
  teamID: number;

  /**
   * Constructor
   */
  public constructor() {
    super();
    this.entityType = EntityType.TURN;
    this.state = TurnState.NEW;
    this.teamID = -1;
  }
}
