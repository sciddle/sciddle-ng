import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs';
import {LogService} from '../../../log/services/log.service';
import {Card} from '../../model/card/card.model';
import {Stack} from '../../model/stack/stack.model';

/**
 * Handles cards management
 */
@Injectable({
  providedIn: 'root',
})
export class CardsService {

  /** Default index of cards */
  public static CARD_INDEX_DEFAULT = 0;
  /** Index of cards being put away */
  public static CARD_INDEX_OUT_OF_STACK = null;

  /** Currently displayed stack */
  public stack: Stack;
  /** Map of all cards */
  public cards = new Map<string, Card>();
  /** Subject that publishes cards */
  public cardsSubject = new Subject<Card[]>();

  /** Dev mode */
  public devMode = false;

  //
  // Sort
  //

  /**
   * Sorts cards based on their index (highest index first)
   * @param cardA first card
   * @param cardB seconds card
   */
  public static sortCards(cardA: Card, cardB: Card) {
    if (!isNaN(cardA.index) && !isNaN(cardB.index)) {
      return (cardA.index > cardB.index) ? -1 : 1;
    } else {
      return 0;
    }
  }

  /**
   * Sorts cards based on their word
   * @param cardA first card
   * @param cardB seconds card
   */
  public static sortCardsByWord(cardA: Card, cardB: Card) {
    if (cardA.word != null && cardB.word != null) {
      return (cardA.word > cardB.word) ? -1 : 1;
    } else {
      return 0;
    }
  }

  /**
   * Shuffles cards
   * @param cards cards
   */
  public static shuffleCards(cards: Card[]): Card[] {
    LogService.trace(`CardsService#shuffleCards ${cards.length}`);
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

  //
  // Filter
  //

  /**
   * Determines whether a card is part of the current stack
   * @param card card
   */
  public static isCardPartOfStack(card: Card): boolean {
    return card.index !== CardsService.CARD_INDEX_OUT_OF_STACK;
  }

  /**
   * Determines whether a card's difficulty is easy
   * @param card card
   */
  public static isEasy(card: Card): boolean {
    return CardsService.isCardPartOfStack(card) && card.difficulty === 1;
  }

  /**
   * Determines whether a card's difficulty is medium
   * @param card card
   */
  public static isMedium(card: Card): boolean {
    return CardsService.isCardPartOfStack(card) && card.difficulty === 2;
  }

  /**
   * Determines whether a card's difficulty is hard
   * @param card card
   */
  public static isHard(card: Card): boolean {
    return CardsService.isCardPartOfStack(card) && card.difficulty === 3;
  }

  //
  // Lookup
  //

  /**
   * Get minimum index of a given list of cards
   * @param cards cards
   */
  public static getMinIndex(cards: Card[]): number {
    const min = Math.min(...cards.map((card) => {
      return card.index;
    }).filter((index) => {
      return !isNaN(index);
    }));

    return !isNaN(min) ? min : 0;
  }

  /**
   * Get maximum index of a given list of cards
   * @param cards cards
   */
  public static getMaxIndex(cards: Card[]): number {
    const max = Math.max(...cards.map((card) => {
      return card.index;
    }).filter((index) => {
      return !isNaN(index);
    }));

    return !isNaN(max) ? max : 0;
  }

  /**
   * Constructor
   */
  constructor() {
    this.devMode = isDevMode();
  }

  //
  // Initialization
  //

  /**
   * Initializes stack
   * @param stack stack
   */
  public initializeStack(stack: Stack) {
    if (stack != null && stack.cards != null) {
      LogService.trace(`CardsService#initializeCards ${stack.cards.length}`);

      this.stack = stack;
      this.cards.clear();
      let index = 10_000;
      stack.cards.forEach((card) => {
        if (card.id == null) {
          card.id = index.toString();
          card.index = index;
          index++;
        }
        this.cards.set(card.id, card);
      });
      this.notify();
    }
  }

  //
  // State
  //

  /**
   * Sorts cards of a given stack
   * @param stack stack
   */
  public sortStack(stack: Stack): Promise<Stack> {
    return new Promise((resolve) => {
      let index = 0;

      // Assign new indices to shuffled cards
      stack.cards
        .filter(CardsService.isCardPartOfStack)
        .sort(CardsService.sortCardsByWord)
        .forEach((card) => {
          card.index = index++;
        });

      resolve(stack);
    });
  }

  /**
   * Shuffles cards of a given stack
   * @param stack stack
   */
  public shuffleStack(stack: Stack): Promise<Stack> {
    return new Promise((resolve) => {
      let index = 0;

      // Assign new indices to shuffled cards
      CardsService
        .shuffleCards(stack.cards.filter(CardsService.isCardPartOfStack))
        .forEach((card) => {
          card.index = index++;
        });

      resolve(stack);
    });
  }

  /**
   * Moves a card with a given difficulty to top of the stack
   * @param stack stack
   * @param difficulty difficulty
   */
  public moveCardWithSpecificDifficultyToTop(stack: Stack, difficulty: number): Promise<Stack> {

    return new Promise((resolve) => {
      // Find card in stack with desired difficulty
      const card = CardsService.shuffleCards(stack.cards)
        .filter(CardsService.isCardPartOfStack)
        .filter((c) => {
          return c.difficulty === difficulty;
        })[0];

      if (card != null) {
        const maxIndex = CardsService
          .getMaxIndex(Array.from(this.cards.values()).filter(CardsService.isCardPartOfStack));

        card.index = maxIndex + 1;

        this.updateCard(stack, card).then(() => {
          stack.cards = stack.cards
            .filter(CardsService.isCardPartOfStack)
            .sort(CardsService.sortCards);
          resolve(stack);
        });

      } else {
        stack.cards = stack.cards
          .filter(CardsService.isCardPartOfStack)
          .sort(CardsService.sortCards);
        resolve(stack);
      }
    });
  }

  /**
   * Puts card a the end of a stack
   * @param stack stack
   * @param card card
   */
  public putCardToEnd(stack: Stack, card: Card): Promise<Stack> {
    return new Promise((resolve, reject) => {

      // const maxIndex = CardsService.getMaxIndex(Array.from(this.cards.values()));
      const minIndex = CardsService.getMinIndex(Array.from(this.cards.values()));

      // Move card to last position
      card.index = minIndex - 1;

      // Normalize indices
      // stack.cards.filter(CardsService.isCardPartOfStack).map(c => {
      //   c.index = c.index - minIndex;
      // });

      this.updateCard(stack, card).then(() => {
        resolve(stack);
      }, () => {
        reject(stack);
      });
    });
  }

  /**
   * Puts card away by giving it the index CARD_INDEX_OUT_OF_STACK
   * @param stack stack
   * @param card card
   */
  public putCardAway(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve) => {
      card.index = CardsService.CARD_INDEX_OUT_OF_STACK;
      this.updateCard(stack, card).then(() => {
        resolve(null);
      });
    });
  }

  /**
   * Puts all cards back to stack
   * @param stack stack
   */
  public putCardsBackToStack(stack: Stack): Promise<Stack> {
    return new Promise((resolve) => {
      stack.cards.forEach((card) => {
        if (card.index === CardsService.CARD_INDEX_OUT_OF_STACK) {
          card.index = CardsService.CARD_INDEX_DEFAULT;
        }
        this.updateCard(stack, card);
      });

      resolve(stack);
    });
  }

  /**
   * Updates an existing card
   * @param stack stack
   * @param card card to be updated
   */
  public updateCard(stack: Stack, card: Card): Promise<any> {
    LogService.trace(`CardsService#updateCard`);
    return new Promise((resolve, reject) => {
      if (card == null) {
        reject();
      }

      this.updateCardOfStack(stack, card);
      resolve(null);
    });
  }

  /**
   * Updates card of stack
   * @param stack stack
   * @param card card
   */
  private updateCardOfStack(stack: Stack, card: Card) {
    // Get index of the card to be updated
    const index = stack.cards.findIndex((c) => {
      return c.id === card.id;
    });

    // Update the card
    stack.cards[index] = card;
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    LogService.trace(`CardsService#notify ${Array.from(this.cards.values()).length}`);
    this.cardsSubject.next(Array.from(this.cards.values()).sort(CardsService.sortCards));
  }
}
