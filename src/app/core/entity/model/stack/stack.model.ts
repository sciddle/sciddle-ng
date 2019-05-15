import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';
import {Card} from '../card/card.model';

/**
 * Represents a stack
 */
export class Stack extends Entity {

  /** Title */
  title: string;
  /** Cards */
  cards: Card[];

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.STACK;
    this.title = '';
    this.cards = [];
  }
}
