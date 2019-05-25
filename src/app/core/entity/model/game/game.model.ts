import {Entity} from '../entity.model';
import {Team} from './team.model';
import {EntityType} from '../entity-type.enum';

/**
 * Represents a game
 */
export class Game extends Entity {

  /** Teams that play the game */
  teams: Team[];

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.GAME;
    this.teams = [];
  }
}
