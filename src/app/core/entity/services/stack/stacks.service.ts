import {Injectable} from '@angular/core';
import {Stack} from '../../model/stack/stack.model';

/**
 * Handles cards
 */
@Injectable({
  providedIn: 'root'
})
export class StacksService {

  //
  // Sort
  //

  /**
   * Sorts stacks based on their modification date
   * @param stackA first stack
   * @param stackB seconds stack
   */
  static sortStacks(stackA: Stack, stackB: Stack) {
    return 1;
  }
}
