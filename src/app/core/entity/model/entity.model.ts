import {EntityType} from './entity-type.enum';
import {UUID} from './uuid';

/**
 * Superclass of all entities
 */
export abstract class Entity {

  /** Entity type */
  entityType: EntityType;
  /** Unique identifier */
  id: string;
  /** Creation date */
  creationDate: Date;
  /** Modification date */
  modificationDate: Date;

  /**
   * Constructor
   */
  protected constructor() {
    this.id = new UUID().toString();
    this.creationDate = new Date();
    this.modificationDate = new Date();
  }
}
