import {Inject, Injectable} from '@angular/core';
import {Stack} from '../../model/stack/stack.model';
import {CardsService} from '../card/cards.service';
import {Game} from '../../model/game/game.model';
import {Team} from '../../model/game/team.model';
import {ColorService} from '../../../ui/services/color.service';
import {STACK_PERSISTENCE_POUCHDB} from '../../entity.module';
import {StacksPersistenceService} from '../stack/persistence/stacks-persistence.interface';
import {GameMode} from '../../model/game-mode.enum';
import {Subject} from 'rxjs';
import {GameState} from '../../model/game-state.enum';
import {Turn} from '../../model/game/turn.model';
import {TurnState} from '../../model/turn-state.enum';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  /** Game currently played */
  game: Game;
  /** Subject that publishes game */
  gameSubject = new Subject<Game>();

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
  static getGameModeByStack(stack: Stack): GameMode {
    if (stack != null && stack.game != null) {
      return GamesService.getGameMode(stack.game);
    }

    return GameMode.SINGLE_PLAYER;
  }

  static getGameMode(game: Game): GameMode {
    if (game.teams == null || game.teams.length < 2) {
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

  /**
   * Initializes a game
   * @param game game
   */
  initializeGame(game: Game) {
    if (game != null) {
      this.game = game;
      this.notify();
    }
  }

  //
  // Game state machine
  // In this section all steps of a game are handled
  //

  /**
   * Starts game
   * @param game game to be started
   */
  public startGame(game: Game): Promise<any> {
    return new Promise(resolve => {
      this.game = game;
      this.game.state = GameState.ONGOING;
      this.notify();

      resolve();
    });
  }

  /**
   * Starts turn
   * @param game game
   */
  public startTurn(game: Game): Promise<any> {
    console.log(`startTurn`);
    return new Promise(resolve => {
      this.game = game;
      this.game.turn = new Turn();
      this.game.turn.state = TurnState.DISPLAY_TEAM_TAKING_TURN;
      this.game.turn.teamID = 0;
      this.notify();

      resolve();
    });
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.gameSubject.next(this.game);
  }
}
