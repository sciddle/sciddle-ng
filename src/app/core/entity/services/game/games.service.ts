import {Injectable} from '@angular/core';
import {Stack} from '../../model/stack/stack.model';
import {CardsService} from '../card/cards.service';
import {Game} from '../../model/game/game.model';
import {Team} from '../../model/game/team.model';
import {ColorService} from '../../../ui/services/color.service';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  /**
   * Constructor
   * @param cardsService cards service
   * @param colorService color service
   */
  constructor(private cardsService: CardsService,
              private colorService: ColorService) {
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
      this.cardsService.shuffleStack(stack);
      stack.game = new Game();
      resolve();
    });
  }

  /**
   * Initializes a multi-player game
   *
   * @param stack to initialize game for
   * @param teamCount number of teams
   */
  initMultiPlayerGame(stack: Stack, teamCount: number): Promise<any> {
    return new Promise((resolve) => {
      this.cardsService.shuffleStack(stack);
      stack.game = new Game();
      stack.game.teams = [];

      for (let i = 0; i < teamCount; i++) {
        const team = new Team();
        team.color = this.colorService.getTeamColor(i);
        stack.game.teams.push(team);
      }

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
