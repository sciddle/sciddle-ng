import {Injectable} from '@angular/core';
import {Stack} from '../../model/stack/stack.model';
import {StacksService} from '../stack/stacks.service';
import {CardsAssetsService} from '../card/cards-assets.service';
import {Card} from '../../model/card/card.model';
import {CardsService} from '../card/cards.service';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  /**
   * Constructor
   * @param cardsService cards service
   */
  constructor(private cardsService: CardsService) {
  }

  //
  // Initialization
  //

  /**
   * Initializes a single-player game
   * @param stack to initialize game for
   */
  initSinglePlayerGame(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      stack.game = null;
      resolve();
    });
  }

  /**
   * Initializes a multi-player game
   *
   * @param stack to initialize game for
   */
  initMultiPlayerGame(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      stack.game = null;
      resolve();
    });
  }

  /**
   * Determine whether a given stack is currently played in single player mode
   * @param stack stack
   */
  isSinglePlayerGame(stack: Stack): boolean {
    return stack.game == null
      || stack.game.teams == null
      || stack.game.teams.length < 2;
  }
}
