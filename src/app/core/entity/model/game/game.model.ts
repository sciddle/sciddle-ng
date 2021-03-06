import {Entity} from '../entity.model';
import {Team} from './team.model';
import {EntityType} from '../entity-type.enum';
import {GameState} from '../game-state.enum';
import {Turn} from './turn.model';

/**
 * Represents a game
 */
export class Game extends Entity {

  /** State of the game */
  state: GameState;
  /** Current turn */
  turn: Turn;
  /** Teams that play the game */
  teams: Team[];
  /** Use time limit */
  useTimeLimit: boolean;
  /** Use acoustic alarm */
  useAlarm: boolean;

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
