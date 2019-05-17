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

  /**
   * Constructor
   */
  protected constructor() {
    this.id = new UUID().toString();
  }
}
