import {Card} from '../card/card.model';
import {EntityType} from '../entity-type.enum';
import {Entity} from '../entity.model';
import {Game} from '../game/game.model';

/**
 * Represents a stack
 */
export class Stack extends Entity {

  /** Title */
  public title: string;
  /** Cards */
  public cards: Card[];
  /** Game the stack is used for */
  public game: Game;
  /** Theme */
  public theme: string;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.STACK;
    this.title = '';
    this.cards = [];
    this.game = null;
    this.theme = '';
  }
}
