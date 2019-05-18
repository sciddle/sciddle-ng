import {Injectable} from '@angular/core';
import {Stack} from '../../model/stack/stack.model';
import {Card} from '../../model/card/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  //
  // Sort
  //

  /**
   * Shuffles cards
   * @param cards cards
   */
  static shuffleCards(cards: Card[]): Card[] {
    let currentIndex = cards.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }

    return cards;
  }

  constructor() {
  }

  //
  // State
  //

  /**
   * Shuffles cards of a given stack
   * @param stack stack
   */
  public shuffleStack(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      let index = 0;

      // Assign new indices to shuffled cards
      CardsService.shuffleCards(stack.cards).forEach(card => {
        card.index = index++;
      });

      resolve();
    });
  }
}
