import {Entity} from '../entity.model';
import {Team} from './team.model';
import {EntityType} from '../entity-type.enum';

/**
 * Represents a game
 */
export class Game extends Entity {

  /** ID of the stack to play with */
  stackID: number;
  /** Teams that play the game */
  teams: Team[];

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.GAME;
    this.stackID = -1;
    this.teams = [];
  }
}
