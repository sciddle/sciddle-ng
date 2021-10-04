import {EntityType} from '../entity-type.enum';
import {Entity} from '../entity.model';
import {GameState} from '../game-state.enum';
import {Team} from './team.model';
import {Turn} from './turn.model';

/**
 * Represents a game
 */
export class Game extends Entity {

  /** State of the game */
  public state: GameState;
  /** Current turn */
  public turn: Turn;
  /** Teams that play the game */
  public teams: Team[];
  /** Use time limit */
  public useTimeLimit: boolean;
  /** Use acoustic alarm */
  public useAlarm: boolean;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.GAME;
    this.state = GameState.UNINIZIALIZED;
    this.turn = new Turn();
    this.teams = [];
    this.useTimeLimit = false;
    this.useAlarm = false;
  }
}
