import {EntityType} from '../entity-type.enum';
import {Entity} from '../entity.model';
import {TurnState} from '../turn-state.enum';

/**
 * Represents a turn
 */
export class Turn extends Entity {

  /** State of the turn */
  public state: TurnState;
  /** ID of team taking turn */
  public teamID: number;

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
