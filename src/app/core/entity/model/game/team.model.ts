import {EntityType} from '../entity-type.enum';
import {Entity} from '../entity.model';

/**
 * Represents a team
 */
export class Team extends Entity {

  /** Index */
  public index: number;
  /** Score of the team */
  public score: number;
  /** Team icon */
  public icon: string;
  /** Team color */
  public color: string;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.TEAM;
    this.index = -1;
    this.score = 0;
    this.icon = '';
    this.color = '';
  }
}
