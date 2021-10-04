import {EntityType} from '../entity-type.enum';
import {Entity} from '../entity.model';

/**
 * Represents a card
 */
export class Card extends Entity {

  /** Index of this card */
  public index?: number;
  /** Word to be explained */
  public word: string;
  /** Words that must not be used during description */
  public taboos: string[];
  /** Difficulty of the term to be explained */
  public difficulty: number;

  /** Alternate explanation text */
  public alternateExplanationText: string;
  /** Alternate Wikipedia article */
  public alternateWikipediaArticle: string;
  /** Alternate URL */
  public alternateURL: string;

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
