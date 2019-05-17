import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';

/**
 * Represents a card
 */
export class Card extends Entity {

  /** Word to be explained */
  word: string;
  /** Words that must not be used during description */
  taboos: string[];
  /** Index of this card */
  index: number;
  /** Difficulty of the term to be explained */
  difficulty: number;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.CARD;
    this.word = '';
    this.taboos = [];
    this.index = 0;
    this.difficulty = 1;
  }
}
