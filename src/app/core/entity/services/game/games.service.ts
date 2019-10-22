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
import {TurnState} from '../../model/turn-state.enum';
import {Card} from '../../model/card/card.model';
import {LogService} from '../../../log/services/log.service';

/**
 * Handles games lifecycle
 */
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
    LogService.trace(`GamesService#existsGame ${stack != null && stack.game != null}`);
    return stack != null && stack.game != null;
  }

  /**
   * Determines game mode
   * @param stack stack
   */
  static getGameModeByStack(stack: Stack): GameMode {
    if (stack != null && stack.game != null) {
      return GamesService.getGameMode(stack.game);
    }

    return GameMode.SINGLE_PLAYER;
  }

  /**
   * Returns game mode
   * @param game game
   */
  static getGameMode(game: Game): GameMode {
    if (game.teams == null || game.teams.length < 2) {
      return GameMode.SINGLE_PLAYER;
    } else {
      return GameMode.MULTI_PLAYER;
    }
  }

  /**
   * Awards points to a given team
   * @param team team
   * @param points points
   */
  static awardPoints(team: Team, points: number) {
    team.score += points;
  }

  /**
   * Determines next team
   * @param game game
   */
  static determineNextTeam(game: Game): number {
    game.turn.teamID++;
    if (game.turn.teamID >= game.teams.length) {
      game.turn.teamID = 0;
    }

    return game.turn.teamID;
  }

  /**
   * Determines whether a game is over
   * @param cards cards
   */
  static isGameOver(cards: Card[]): boolean {
    return cards.length === 0;
  }

  /**
   * Determines teams with the highest score
   * @param game game
   */
  static determineWinningTeams(game: Game): Team[] {

    const maxScore = GamesService.getMaxScore(game.teams);

    return game.teams.filter(team => {
      return team.score === maxScore;
    });
  }

  /**
   * Get maximum score of a given list of teams
   * @param teams teams
   */
  static getMaxScore(teams: Team[]): number {
    const max = Math.max(...teams.map(team => {
      return team.score;
    }).filter(index => {
      return !isNaN(index);
    }));

    return !isNaN(max) ? max : 0;
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
    LogService.trace(`GamesService#initializeSinglePlayerGame`);
    return new Promise((resolve) => {
      this.game = new Game();

      stack.game = this.game;
      resolve();
    });
  }

  /**
   * Initializes a multi-player game
   *
   * @param stack to initialize game for
   * @param teamCount number of teams
   * @param useTimeLimit usage of time limit
   * @param difficultyEasy difficulty easy
   * @param difficultyMedium difficulty medium
   * @param difficultyHard difficulty hard
   * @param cardCount card count
   */
  initializeMultiPlayerGame(stack: Stack, teamCount: number, useTimeLimit: boolean,
                            difficultyEasy: boolean, difficultyMedium: boolean, difficultyHard: boolean,
                            cardCount: number): Promise<Stack> {
    LogService.trace(`GamesService#initializeMultiPlayerGame`);
    return new Promise((resolve) => {
      this.game = new Game();

      this.game = new Game();
      this.game.teams = [];
      this.game.useTimeLimit = useTimeLimit;

      stack.game = this.game;
      stack.cards = stack.cards.filter(c => {
        return (c.difficulty === 1 && difficultyEasy)
          || (c.difficulty === 2 && difficultyMedium)
          || (c.difficulty === 3 && difficultyHard);
      }).slice(0, cardCount);

      for (let i = 0; i < teamCount; i++) {
        const team = new Team();
        team.index = i;
        team.color = this.colorService.getTeamColor(i);
        stack.game.teams.push(team);
      }

      resolve(stack);
    });
  }

  /**
   * Initializes a game
   * @param game game
   */
  initializeGame(game: Game) {
    LogService.trace(`GamesService#initialiteGame`);
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
    LogService.trace(`GamesService#startGame`);
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
  public startTurn(game: Game): Promise<Game> {
    LogService.trace(`GamesService#startTurn`);
    return new Promise(resolve => {
      this.game = game;
      this.game.turn.state = TurnState.DISPLAY_TEAM_TAKING_TURN;
      this.game.turn.teamID = GamesService.determineNextTeam(this.game);
      this.notify();

      resolve(this.game);
    });
  }

  /**
   * Displays difficulty selection screen
   * @param game game
   */
  public showDifficultySelection(game: Game): Promise<any> {
    LogService.trace(`GamesService#showDifficultySelection`);
    return new Promise(resolve => {
      this.game = game;
      this.game.turn.state = TurnState.DISPLAY_DIFFICULTY_SELECTION;
      this.notify();

      resolve();
    });
  }

  /**
   * Displays a card of a given difficulty
   * @param game game
   * @param difficulty difficulty
   */
  public showCard(game: Game, difficulty: number): Promise<any> {
    LogService.trace(`GamesService#showCard`);
    return new Promise(resolve => {
      this.game = game;
      this.game.turn.state = TurnState.DISPLAY_CARDS;
      this.notify();

      resolve();
    });
  }

  /**
   * Shows turn evaluation
   * @param game game
   */
  public showTurnEvaluation(game: Game): Promise<any> {
    LogService.trace(`GamesService#showTurnEvaluation`);
    return new Promise(resolve => {
      this.game = game;
      this.game.turn.state = TurnState.DISPLAY_TURN_EVALUATION;
      this.notify();

      resolve();
    });
  }

  /**
   * Evaluates turn by
   * <li>awarding points to a team
   * @param game game
   * @param teamID team ID of team which guessed correctly
   * @param difficulty difficulty
   */
  public evaluateTurn(game: Game, teamID: number, difficulty: number): Promise<any> {
    LogService.trace(`GamesService#evaluateTurn`);
    return new Promise(resolve => {
      this.game = game;
      this.game.turn.state = TurnState.DISPLAY_SCORE_OVERVIEW;

      if (teamID != null) {
        // Give points to team taking turn
        GamesService.awardPoints(game.teams.filter(team => {
          return team.index === game.turn.teamID;
        })[0], difficulty);
        // Give points to team that guessed correctly
        GamesService.awardPoints(game.teams.filter(team => {
          return team.index === teamID;
        })[0], difficulty);
      }

      this.notify();

      resolve();
    });
  }

  /**
   * Closes turn
   * @param cards cards
   * @param game game
   */
  public closeTurn(cards: Card[], game: Game) {
    LogService.trace(`GamesService#closeTurn`);
    return new Promise(resolve => {

      if (GamesService.isGameOver(cards)) {
        this.game.state = GameState.FINISHED;
      } else {
        this.game = game;
        this.game.turn.state = TurnState.NEW;
      }

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
    LogService.trace(`GamesService#notify`);
    this.gameSubject.next(this.game);
  }
}
