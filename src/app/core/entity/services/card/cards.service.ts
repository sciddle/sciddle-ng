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
  // Initialization
  //

  /**
   * Initializes cards
   * @param cards cards
   */
  public initializeCards(cards: Card[]) {
    this.clearCards();
    cards.forEach(card => {
      this.cards.set(card.id, card);
    });
    this.notify();
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
      if (JSON.stringify(cardsAfter.toString()) != JSON.stringify(cardsBefore.toString())) {
        resolve(Array.from(this.cards.values()));
      } else {
        this.notify();
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
      CardsService.shuffleCards(stack.cards).forEach(card => {
        card.index = index++;
      });

      resolve();
    });
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
