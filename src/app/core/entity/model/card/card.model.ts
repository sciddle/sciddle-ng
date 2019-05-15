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
  constructor(word: string, taboos: string[], difficulty: number) {
    super();
    this.entityType = EntityType.CARD;
    this.word = word;
    this.taboos = taboos;
    this.difficulty = difficulty;

    this.index = 0;
  }
}
