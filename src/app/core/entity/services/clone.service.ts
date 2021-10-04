import {Injectable} from '@angular/core';
import {Card} from '../model/card/card.model';
import {Stack} from '../model/stack/stack.model';

/**
 * Creates deep copies of objects
 */
@Injectable({
  providedIn: 'root',
})
export class CloneService {

  /**
   * Clones a given stack
   * @param original original
   * @returns cloned object
   */
  public static cloneStack(original: Stack): Stack {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of stacks
   * @param original original
   * @returns cloned object
   */
  public static cloneStacks(original: Stack[]): Stack[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given card
   * @param original original
   * @returns cloned object
   */
  public static cloneCard(original: Card): Card {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of cards
   * @param original original
   * @returns cloned object
   */
  public static cloneCards(original: Card[]): Card[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }
}
