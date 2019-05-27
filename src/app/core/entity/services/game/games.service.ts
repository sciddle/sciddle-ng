import {Inject, Injectable} from '@angular/core';
import {Stack} from '../../model/stack/stack.model';
import {CardsService} from '../card/cards.service';
import {Game} from '../../model/game/game.model';
import {Team} from '../../model/game/team.model';
import {ColorService} from '../../../ui/services/color.service';
import {STACK_PERSISTENCE_POUCHDB} from '../../entity.module';
import {StacksPersistenceService} from '../stack/persistence/stacks-persistence.interface';
import {GameMode} from '../../model/game-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  //
  // Static methods
  //

  /**
   * Determines if an active game exists
   * @param stack stack
   */
  static existsGame(stack: Stack) {
    return stack != null && stack.game != null;
  }

  /**
   * Returns current game mode
   * @param stack stack
   */
  static getGameMode(stack: Stack): GameMode {
    if (stack.game == null
      || stack.game.teams == null
      || stack.game.teams.length < 2) {
      return GameMode.SINGLE_PLAYER;
    } else {
      return GameMode.MULTI_PLAYER;
    }
  }

  /**
   * Constructor
   * @param cardsService cards service
   * @param colorService color service
   * @param stacksPersistenceService stacks persistence service
   */
  constructor(private cardsService: CardsService,
              private colorService: ColorService,
              @Inject(STACK_PERSISTENCE_POUCHDB) private stacksPersistenceService: StacksPersistenceService) {
  }

  //
  // Initialization
  //

  /**
   * Initializes a single-player game
   * @param stack to initialize game for
   */
  initializeSinglePlayerGame(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
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
  initializeMultiPlayerGame(stack: Stack, teamCount: number): Promise<any> {
    return new Promise((resolve) => {
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
}
