import {Injectable} from '@angular/core';
import {Stack} from '../model/stack/stack.model';
import {Card} from '../model/card/card.model';

/**
 * Creates deep copies of objects
 */
@Injectable({
  providedIn: 'root'
})
export class CloneService {

  /**
   * Clones a given stack
   * @param original original
   * @returns cloned object
   */
  static cloneStack(original: Stack): Stack {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of stacks
   * @param original original
   * @returns cloned object
   */
  static cloneStacks(original: Stack[]): Stack[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given card
   * @param original original
   * @returns cloned object
   */
  static cloneCard(original: Card): Card {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of cards
   * @param original original
   * @returns cloned object
   */
  static cloneCards(original: Card[]): Card[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }
}
