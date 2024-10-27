import {HttpClient} from '@angular/common/http';
import {Injectable, isDevMode} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {LogService} from '../../../log/services/log.service';
import {Card} from '../../model/card/card.model';
import {Stack} from '../../model/stack/stack.model';
import {CloneService} from '../clone.service';
import {TranslocoService} from "@ngneat/transloco";

/**
 * Handles stacks
 */
@Injectable({
  providedIn: 'root',
})
export class StacksService {

  /** Stacks */
  public static stacks = new Map<string, string>();

  /** Dev mode */
  public devMode = false;

  //
  // Sort
  //

  /**
   * Sorts stacks based on their modification date
   * @param stackA first stack
   * @param stackB seconds stack
   */
  public static sortStacks(stackA: Stack, stackB: Stack) {
    return stackA.id > stackB.id ? 1 : -1;
  }

  /**
   * Returns IDs of uninitialized stacks
   * @param stacks already existing stacks
   */
  public static getUninitializedStackIDs(stacks: Stack[]): string[] {
    return Array.from(this.stacks.keys()).filter((id) => {
      return (!stacks.some((existingStack) => {
        return existingStack != null && existingStack.id === id;
      }));
    });
  }

  /**
   * Returns IDs of uninitialized stacks
   * @param stacks already existing stacks
   */
  public static getUninitializedDefaultStackIDs(stacks: Stack[]): string[] {
    return [environment.DEFAULT_STACK.toString()].filter((id) => {
      return (!stacks.some((existingStack) => {
        return existingStack != null && existingStack.id === id;
      }));
    });
  }

  /**
   * Constructor
   * @param http http client
   * @param translocoService transloco service
   */
  constructor(
    private http: HttpClient,
    private translocoService: TranslocoService
  ) {
    this.devMode = isDevMode();
    switch (translocoService.getActiveLang()) {
      case "de": {
        StacksService.stacks.set('0', 'climate-de.json');
        StacksService.stacks.set('2', 'future-de.json');
        StacksService.stacks.set('3', 'physics-de.json');
        StacksService.stacks.set('4', 'physics-de-school.json');
        StacksService.stacks.set('5', 'anthropology-de.json');
        break;
      }
      case "en": {
        StacksService.stacks.set('3', 'physics-en.json');
        break;
      }
    }
  }

  /**
   * Merge stack from assets into given stack of the same ID
   * @param stack stack
   */
  public mergeStackFromAssets(stack: Stack): Promise<Stack> {
    LogService.trace(`StacksService#mergeStackFromAssets`);

    return new Promise<Stack>((resolve, reject) => {
      const fileName = StacksService.stacks.get(stack.id);

      if (fileName != null) {
        this.getStackFromAssets(fileName).then((stackFromAsset) => {
          stack.title = stackFromAsset.title;
          stack.theme = stackFromAsset.theme;

          this.mergeCardsFromAssets(stack, stackFromAsset.cards).then((mergedCards) => {
            if (mergedCards != null) {
              stack.cards = mergedCards as Card[];
            }
            resolve(stack);
          }, () => {
            reject(stack);
          });
        });
      } else {
        reject();
      }
    });
  }

  /**
   * Loads all stacks from assets
   * @param fileName fileName
   */
  public getStackFromAssets(fileName: string): Promise<Stack> {
    LogService.trace(`StacksService#getStackFromAssets ${fileName}`);

    return new Promise((resolve) => {
      this.http.get(`assets/stacks/${fileName}`).subscribe(
        (data) => {
          const stackFromAsset = data as Stack;
          resolve(stackFromAsset);
        });
    });
  }

  /**
   * Takes stacks from assets and merges them into existing stack
   *
   * @param stack stack
   * @param cardsFromAssets stacks loaded from assets
   */
  public mergeCardsFromAssets(stack: Stack, cardsFromAssets: Card[]): Promise<Card[]> {
    LogService.trace(`StacksService#mergeCardsFromAssets ${cardsFromAssets.length}`);

    // Extract existing cards into map
    const cards = new Map<string, Card>();
    stack.cards.forEach((card) => {
      cards.set(card.id, card);
    });

    // Save stacks before merge
    const cardsBefore = CloneService.cloneCards(Array.from(cards.values()));

    return new Promise((resolve, reject) => {
      cardsFromAssets.slice(0, environment.MAX_CARD_COUNT).forEach((card, index) => {
        // Dynamically set id and index
        card.id = index.toString();
        card.index = index;

        // Get existing card
        const existingCard = cards.get(card.id);

        if (existingCard != null) {
          // Update existing card
          existingCard.word = card.word;
          existingCard.taboos = card.taboos;
          existingCard.difficulty = card.difficulty;
          existingCard.category = card.category;
          existingCard.alternateExplanationText = card.alternateExplanationText;
          existingCard.alternateWikipediaArticle = card.alternateWikipediaArticle;

          // Add updated card to map
          cards.set(existingCard.id, existingCard);
        } else {
          // Simply add new card to map
          cards.set(card.id, card);
        }
      });

      // Save stacks after merge
      const cardsAfter = CloneService.cloneCards(Array.from(cards.values()));

      // Check if cards have been changed
      if (JSON.stringify(cardsAfter).toString() !== JSON.stringify(cardsBefore).toString()) {
        resolve(Array.from(cards.values()));
      } else {
        reject();
      }
    });
  }
}
