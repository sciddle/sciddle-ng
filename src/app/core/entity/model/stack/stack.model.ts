import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';
import {Card} from '../card/card.model';
import {Game} from '../game/game.model';

/**
 * Represents a stack
 */
export class Stack extends Entity {

  /** Title */
  title: string;
  /** Cards */
  cards: Card[];
  /** Game the stack is used for */
  game: Game;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.STACK;
    this.title = '';
    this.cards = [];
    this.game = null;
  }
}
