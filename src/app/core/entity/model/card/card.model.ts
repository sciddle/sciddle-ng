import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';

/**
 * Represents a card
 */
export class Card extends Entity {

  /** Index of this card */
  index?: number;
  /** Word to be explained */
  word: string;
  /** Words that must not be used during description */
  taboos: string[];
  /** Difficulty of the term to be explained */
  difficulty: number;

  /** Alternate explanation text */
  alternateExplanationText: string;
  /** Alternate Wikipedia article */
  alternateWikipediaArticle: string;
  /** Alternate URL */
  alternateURL: string;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.CARD;
    this.index = 0;
    this.word = '';
    this.taboos = [];
    this.difficulty = 1;

    this.alternateExplanationText = null;
    this.alternateWikipediaArticle = null;
    this.alternateURL = null;
  }
}
