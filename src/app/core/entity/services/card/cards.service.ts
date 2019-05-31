import {Injectable} from '@angular/core';
import {Stack} from '../../model/stack/stack.model';
import {Card} from '../../model/card/card.model';
import {Subject} from 'rxjs';
import {CloneService} from '../clone.service';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  /** Map of all cards */
  cards = new Map<string, Card>();
  /** Subject that publishes cards */
  cardsSubject = new Subject<Card[]>();

  //
  // Sort
  //

  /**
   * Sorts cards based on their modification date
   * @param cardA first card
   * @param cardB seconds card
   */
  static sortCards(cardA: Card, cardB: Card) {
    if (!isNaN(cardA.index) && !isNaN(cardB.index)) {
      return (cardA.index > cardB.index) ? -1 : 1;
    } else {
      return 0;
    }
  }

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

  //
  // Filter
  //

  /**
   * Determines whether a card is part of the current stack
   * @param card card
   */
  static isCardPartOfStack(card: Card): boolean {
    return card.index >= 0;
  }

  /**
   * Determines whether a card's difficulty is easy
   * @param card card
   */
  static isEasy(card: Card): boolean {
    return card.difficulty === 1;
  }

  /**
   * Determines whether a card's difficulty is medium
   * @param card card
   */
  static isMedium(card: Card): boolean {
    return card.difficulty === 2;
  }

  /**
   * Determines whether a card's difficulty is hard
   * @param card card
   */
  static isHard(card: Card): boolean {
    return card.difficulty === 3;
  }

  //
  // Lookup
  //

  /**
   * Get minimum index of a given list of cards
   * @param cards cards
   */
  static getMinIndex(cards: Card[]): number {
    const min = Math.min(...cards.map(card => {
      return card.index;
    }).filter(index => {
      return !isNaN(index);
    }));

    return !isNaN(min) ? min : 0;
  }

  //
  // Initialization
  //

  /**
   * Initializes cards
   * @param cards cards
   */
  public initializeCards(cards: Card[]) {
    if (cards != null) {
      this.clearCards();
      cards.forEach(card => {
        this.cards.set(card.id, card);
      });
      this.notify();
    }
  }

  /**
   * Takes cards from assets and merges them into existing stack
   * @param cardsFromAssets cards loaded from assets
   */
  public mergeCardsFromAssets(cardsFromAssets: Card[]): Promise<Card[]> {
    // Save cards before merge
    const cardsBefore = CloneService.cloneCards(Array.from(this.cards.values()));

    return new Promise((resolve, dismiss) => {
      cardsFromAssets.forEach(card => {
        // Get existing card
        const existingCard = this.cards.get(card.id);

        if (existingCard != null) {
          // Update existing card
          existingCard.word = card.word;
          existingCard.taboos = card.taboos;
          existingCard.difficulty = card.difficulty;

          // Add updated card to map
          this.cards.set(existingCard.id, existingCard);
        } else {
          // Simply add new card to map
          this.cards.set(card.id, card);
        }
      });

      // Save cards after merge
      const cardsAfter = CloneService.cloneCards(Array.from(this.cards.values()));

      // Check if cards have been changed
      if (JSON.stringify(cardsAfter.toString()) !== JSON.stringify(cardsBefore.toString())) {
        resolve(Array.from(this.cards.values()));
      } else {
        dismiss();
      }
    });
  }

  /**
   * Clears cards
   */
  public clearCards() {
    this.cards.clear();
    this.notify();
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
      CardsService
        .shuffleCards(stack.cards.filter(CardsService.isCardPartOfStack))
        .forEach(card => {
          card.index = index++;
        });

      resolve();
    });
  }

  /**
   * Puts card a the end of a stack
   * @param stack stack
   * @param card card
   */
  public putCardToEnd(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve) => {
      card.index = CardsService.getMinIndex(Array.from(this.cards.values())) - 1;
      this.updateCard(stack, card).then(() => {
        resolve();
      });
    });
  }

  /**
   * Puts card away by giving it the index -1
   * @param stack stack
   * @param card card
   */
  public putCardAway(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve) => {
      card.index = -1;
      this.updateCard(stack, card).then(() => {
        resolve();
      });
    });
  }

  /**
   * Updates an existing card
   * @param stack stack
   * @param card card to be updated
   */
  public updateCard(stack: Stack, card: Card):
    Promise<any> {
    return new Promise((resolve, reject) => {
      if (card == null) {
        reject();
      }

      this.updateCardOfStack(stack, card);
      resolve();
    });
  }

  /**
   * Updates card of stack
   * @param stack stack
   * @param card card
   */
  private updateCardOfStack(stack: Stack, card: Card) {
    // Get index of the card to be updated
    const index = stack.cards.findIndex(c => {
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
    this.cardsSubject.next(Array.from(this.cards.values()).sort(CardsService.sortCards));
  }
}
