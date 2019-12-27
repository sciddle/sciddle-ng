import {
  AfterViewInit,
  Component,
  Inject,
  isDevMode,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {Media} from '../../../../core/ui/model/media.enum';
import {environment} from '../../../../../environments/environment';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {filter, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Direction, StackConfig, SwingCardComponent, SwingStackComponent, ThrowEvent} from 'angular2-swing';
import {Card} from '../../../../core/entity/model/card/card.model';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {Stack} from '../../../../core/entity/model/stack/stack.model';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {StacksPersistenceService} from '../../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {STACK_PERSISTENCE_POUCHDB} from '../../../../core/entity/entity.module';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationDialogComponent} from '../../../../ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {GamesService} from '../../../../core/entity/services/game/games.service';
import {GameMode} from '../../../../core/entity/model/game-mode.enum';
import {Game} from '../../../../core/entity/model/game/game.model';
import {GameState} from '../../../../core/entity/model/game-state.enum';
import {TurnState} from '../../../../core/entity/model/turn-state.enum';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {HttpClient} from '@angular/common/http';
import {ROUTE_GAMES} from '../../../../app.routes';
import {Theme} from '../../../../core/ui/model/theme.enum';
import {ThemeService} from '../../../../core/ui/services/theme.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {VariantService} from '../../../../core/util/services/variant.service';
import {Variant} from '../../../../core/util/model/variant.enum';
import {LogService} from '../../../../core/log/services/log.service';
// tslint:disable-next-line:max-line-length
import {CheckableInformationDialogComponent} from '../../../../ui/information-dialog/checkable-information-dialog/checkable-information-dialog.component';
import {Setting} from '../../../../core/settings/model/setting.model';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {StacksService} from '../../../../core/entity/services/stack/stacks.service';

export enum DisplayAspect {
  DISPLAY_CARDS,
  DISPLAY_TEAM_TAKING_TURN,
  DISPLAY_DIFFICULTY_SELECTION,
  DISPLAY_TURN_EVALUATION,
  DISPLAY_SCORE_OVERVIEW,
  DISPLAY_GAME_EVALUATION
}

/**
 * Displays card component
 */
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardsComponent implements OnInit, AfterViewInit, OnDestroy {

  /** App title */
  public title = environment.APP_NAME;

  /** ID passed as an argument */
  public id: string;
  /** Stack */
  public stack: Stack;
  /** Array of cards */
  public cards: Card[] = [];

  /** Number of cards in the stack */
  public cardsInStack = 0;

  /** Game */
  public game: Game;
  /** Game mode */
  public gameMode: GameMode;
  /** Enum of game modes */
  public gameModeType = GameMode;
  /** Array of winning teams */
  public winningTeams = [];

  /** Timer start time */
  public timerStartTime;
  /** Timer duration */
  public timerDuration;
  /** Indicator that timer is over */
  public timerOver = false;
  /** Timer alarm sound */
  private timerAlarm: any;

  /** Current display aspect */
  public displayAspect: DisplayAspect;
  /** Enum of display aspect types */
  public displayAspectType = DisplayAspect;

  /** Map of settings */
  public settingsMap = new Map<string, Setting>();
  /** Setting dont-show-manual-on-startup */
  public dontShowManualOnStartup = false;

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;
  /** Current theme */
  public theme: Theme = Theme.BLUE;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** JSON class for debugging */
  public json = JSON;

  /** Swing stack control */
  @ViewChild('swingStack', {static: false}) swingStack: SwingStackComponent;
  /** Swing cards control */
  @ViewChildren('swingCards') swingCards: QueryList<SwingCardComponent>;

  /** Stack configuration */
  stackConfig: StackConfig;

  /** Factor by which the card is being considered thrown-out, 1=default, 0.5=at half the distance */
  private throwOutFactor = 0.5;
  /** Number of pixels the card needs to be moved before it counts as swiped */
  private throwOutDistance = 800;
  /** Throwout rotation */
  private throwOutRotation = -1;

  /** Dev mode */
  devMode = false;

  /** App variant */
  variant = environment.VARIANT;

  /**
   * Constructor
   * @param cardsService cards service
   * @param dialog dialog
   * @param gamesService games service
   * @param http http client
   * @param iconRegistry iconRegistry
   * @param overlayContainer overlay container
   * @param mediaService media service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param route route
   * @param router router
   * @param sanitizer sanitizer
   * @param settingsService settings service
   * @param snackbarService snackbar service
   * @param stacksPersistenceService stacks persistence service
   * @param stacksService stacks service
   * @param themeService theme service
   */
  constructor(private cardsService: CardsService,
              public dialog: MatDialog,
              private gamesService: GamesService,
              private http: HttpClient,
              private iconRegistry: MatIconRegistry,
              private mediaService: MediaService,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private overlayContainer: OverlayContainer,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private settingsService: SettingsService,
              private snackbarService: SnackbarService,
              @Inject(STACK_PERSISTENCE_POUCHDB) private stacksPersistenceService: StacksPersistenceService,
              private stacksService: StacksService,
              private themeService: ThemeService) {
    this.devMode = isDevMode();
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    LogService.trace(`CardsComponent#ngOnInit`);
    this.initializeStackSubscription();
    this.initializeCardSubscription();
    this.initializeGameSubscription();

    this.initializeSettingsSubscription();
    this.initializeDatabaseErrorSubscription();

    this.initializeMaterial();
    this.initializeMediaSubscription();
    this.initializeThemeSubscription();

    this.initializeThrowOutFactor();
    this.initializeStackConfig();

    this.initializeSounds();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit() {
    LogService.trace(`CardsComponent#ngAfterViewInit`);
    // Try to load existing stack
    switch (VariantService.getVariant()) {
      case Variant.SCIDDLE: {
        this.route.params.subscribe(() => {
          this.id = this.route.snapshot.paramMap.get('id');
          if (this.id != null) {
            this.findEntities(this.id);
            this.findSettings();
          } else {
            this.navigateToGamesPage();
          }
        });

        break;
      }
      case Variant.S4F: {
        this.stacksPersistenceService.findStackByID(environment.DEFAULT_STACK.toString());
        break;
      }
    }
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    LogService.trace(`CardsComponent#ngOnDestroy`);
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  /**
   * Initializes stack subscription
   */
  private initializeStackSubscription() {
    LogService.trace(`CardsComponent#initializeStackSubscription`);
    this.stacksPersistenceService.stackSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      LogService.debug(`CardsComponent > STACK`);
      if (value != null) {
        const stack = value as Stack;
        this.initializeStack(stack).then((initializedStack) => {
          this.stack = initializedStack;
          this.gamesService.initializeGame(initializedStack.game);
        });
      } else {
        this.navigateToGamesPage();
      }
    });
  }

  /**
   * Initializes card subscription
   */
  private initializeCardSubscription() {
    LogService.trace(`CardsComponent#initializeCardSubscription`);
    this.cardsService.cardsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      LogService.debug(`CardsComponent > CARDS`);
      if (value != null) {
        this.initializeCards(value as Card[]);
      }
    });
  }

  /**
   * Initializes turn subscription
   */
  private initializeGameSubscription() {
    LogService.trace(`CardsComponent#initializeGameSubscription`);
    this.gamesService.gameSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      LogService.debug(`CardsComponent > GAME`);
      if (value != null) {
        this.initializeGame(value as Game);
      }
    });
  }

  /**
   * Initializes settings subscription
   */
  private initializeSettingsSubscription() {
    LogService.trace(`CardsComponent#initializeSettingsSubscription`);
    this.settingsService.settingsSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    ).subscribe(value => {
      LogService.debug(`CardsComponent > SETTINGS`);
      if (value != null) {
        const settings = value as Map<string, Setting>;
        this.initializeSettings(settings);
      }
    });
  }

  /**
   * Initializes database error subscription (which handles the case that IndexedDB is not available) by
   * <li>loading data from services if the user navigated here from a previous screen
   * <li>loading data from assets if there is no data stored in services
   */
  private initializeDatabaseErrorSubscription() {
    LogService.trace(`CardsComponent#initializeDatabaseErrorSubscription`);
    this.stacksPersistenceService.databaseErrorSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      // TODO Check error more specifically
      this.snackbarService.showSnackbar('Achtung: Spiel wird nicht gespeichert.');

      if (value != null) {
        // Build stack template
        let stack = new Stack();
        switch (VariantService.getVariant()) {
          case Variant.SCIDDLE: {
            stack.id = this.route.snapshot.paramMap.get('id');
            break;
          }
          case Variant.S4F: {
            stack.id = environment.DEFAULT_STACK.toString();
            break;
          }
        }

        if (this.cardsService.stack != null && this.gamesService.game != null) {
          // Load cards and game stored in services
          LogService.debug(`Load stack and game stored in services`);
          stack = this.cardsService.stack;
          stack.game = this.gamesService.game;

          this.initializeStack(stack).then((initializedStack) => {
            this.stack = initializedStack;
            this.gamesService.initializeGame(initializedStack.game);
          });
        } else {
          // Load cards from assets and initialize new game
          LogService.debug(`Load cards from assets and initialize new game`);

          if (stack.id == null) {
            this.navigateToGamesPage();
          }

          const fileName = StacksService.stacks.get(stack.id);

          this.stacksService.getStackFromAssets(fileName).then(stackFromAssets => {
            if (stackFromAssets != null) {
              stack = stackFromAssets;
              stack.game = new Game();
            }

            this.initializeStack(stack).then((initializedStack) => {
              this.stack = initializedStack;
              this.gamesService.initializeGame(initializedStack.game);

              // Store cards in service
              this.cardsService.initializeStack(initializedStack);
            });
          });
        }
      }
    });
  }

  // Stack

  /**
   * Initializes stack
   * @param stack stack
   */
  private initializeStack(stack: Stack): Promise<Stack> {
    LogService.trace(`CardsComponent#initializeStack`);
    return new Promise((resolve) => {
      if (stack != null) {
        this.initializeTitle(stack);
        this.initializeTheme(stack);
        this.cardsService.initializeStack(stack);

        this.initializeCards(stack.cards);
        this.initializeGameMode(stack);
      }

      resolve(stack);
    });
  }

  // Cards

  /**
   * Initializes cards by filtering them
   * @param cards cards
   */
  private initializeCards(cards: Card[]) {
    LogService.trace(`CardsComponent#initializeCards`);
    this.cards = cards
      .filter(CardsService.isCardPartOfStack)
      .sort(CardsService.sortCards);
    this.cardsInStack = this.cards.length;
  }

  // Game

  /**
   * Initializes game
   * @param game game
   */
  private initializeGame(game: Game) {
    LogService.trace(`CardsComponent#initializeGame`);
    this.game = game;

    switch (GamesService.getGameMode(game)) {
      case GameMode.SINGLE_PLAYER: {
        // If playing alone only display cards
        this.displayAspect = DisplayAspect.DISPLAY_CARDS;
        break;
      }
      case GameMode.MULTI_PLAYER: {
        switch (game.state) {
          case GameState.UNINIZIALIZED:
            // Start game
            this.gamesService.startGame(this.game).then(() => {
              this.snackbarService.showSnackbar('Spiel gestarted');
            });
            break;
          case GameState.ONGOING: {
            // Conduct turn
            switch (game.turn.state) {
              case TurnState.NEW: {
                this.gamesService.startTurn(this.game).then((resolve) => {
                  // Persist data once per turn
                  if (resolve != null) {
                    this.game = resolve as Game;
                    this.stack.game = resolve as Game;
                    this.stacksPersistenceService.updateStack(this.stack).then(() => {
                      this.snackbarService.showSnackbar('Runde gestarted');
                    }, (stack) => {
                      this.snackbarService.showSnackbar('Runde gestarted');
                      this.initializeCards(stack.cards);
                    });
                  }
                });
                break;
              }
              case TurnState.DISPLAY_TEAM_TAKING_TURN: {
                this.displayAspect = DisplayAspect.DISPLAY_TEAM_TAKING_TURN;
                break;
              }
              case TurnState.DISPLAY_DIFFICULTY_SELECTION: {
                this.displayAspect = DisplayAspect.DISPLAY_DIFFICULTY_SELECTION;
                break;
              }
              case TurnState.DISPLAY_CARDS: {
                this.displayAspect = DisplayAspect.DISPLAY_CARDS;
                break;
              }
              case TurnState.DISPLAY_TURN_EVALUATION: {
                this.displayAspect = DisplayAspect.DISPLAY_TURN_EVALUATION;
                break;
              }
              case TurnState.DISPLAY_SCORE_OVERVIEW: {
                this.displayAspect = DisplayAspect.DISPLAY_SCORE_OVERVIEW;
                break;
              }
            }
            break;
          }
          case GameState.FINISHED: {
            this.displayAspect = DisplayAspect.DISPLAY_GAME_EVALUATION;
            break;
          }
        }
        break;
      }
    }
  }

  /**
   * Initializes game mode
   * @param stack stack
   */
  private initializeGameMode(stack: Stack) {
    LogService.trace(`CardsComponent#initializeGameMode`);
    this.gameMode = GamesService.getGameModeByStack(stack);
  }

  // Settings

  /**
   * Initializes settings
   * @param settingsMap settings map
   */
  private initializeSettings(settingsMap: Map<string, Setting>) {
    LogService.trace(`CardsComponent#initializeSettings`);
    this.settingsMap = new Map(settingsMap);
    this.dontShowManualOnStartup = SettingsService.isSettingActive(SettingType.DONT_SHOW_MANUAL_ON_STARTUP, this.settingsMap);

    if (this.dontShowManualOnStartup !== null && this.dontShowManualOnStartup === false) {
      this.onMenuItemClicked('manual');
    }
  }

  // Others

  /**
   * Initializes theme subscription
   */
  private initializeThemeSubscription() {
    LogService.trace(`CardsComponent#initializeThemeSubscription`);
    this.theme = this.themeService.theme;
    this.themeService.themeSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.theme = value as Theme;
    });
  }

  /**
   * Initializes title
   * @param stack stack
   */
  private initializeTitle(stack: Stack) {
    LogService.trace(`CardsComponent#initializeTitle`);
    switch (VariantService.getVariant()) {
      case Variant.SCIDDLE: {
        this.title = stack != null && stack.title != null ? stack.title : this.title;
        break;
      }
      case Variant.S4F: {
        this.title = 'Sciddle';
        break;
      }
    }
  }

  /**
   * Initializes Theme
   * @param stack stack
   */
  private initializeTheme(stack: Stack) {
    LogService.trace(`CardsComponent#initializeTheme`);
    LogService.debug(`stack.theme ${stack.theme}`);

    switch (stack.theme) {
      case 'green': {
        this.themeService.switchTheme(Theme.GREEN);
        break;
      }
      case 'blue': {
        this.themeService.switchTheme(Theme.BLUE);
        break;
      }
      case 'future': {
        this.themeService.switchTheme(Theme.FUTURE);
        break;
      }
      default: {
        switch (VariantService.getVariant()) {
          case Variant.SCIDDLE: {
            this.themeService.switchTheme(Theme.BLUE);
            break;
          }
          case Variant.S4F: {
            this.themeService.switchTheme(Theme.FUTURE);
            break;
          }
        }
        break;
      }
    }
  }

  /**
   * Initializes throw-out factor
   */
  private initializeThrowOutFactor() {
    LogService.trace(`CardsComponent#initializeThrowOutFactor`);
    switch (this.media) {
      case Media.LARGE: {
        this.throwOutFactor *= 1;
        break;
      }
      case Media.MEDIUM: {
        this.throwOutFactor *= 1;
        break;
      }
      case Media.SMALL: {
        this.throwOutFactor *= 1;
        break;
      }
    }
  }

  /**
   * Initializes stack config
   */
  private initializeStackConfig() {
    LogService.trace(`CardsComponent#initializeStackConfig`);
    this.stackConfig = {
      allowedDirections: [Direction.LEFT, Direction.RIGHT],
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min((Math.abs(offsetX) / (element.offsetWidth / 2)) / this.throwOutFactor, 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: () => {
        LogService.debug(`throwOutDistance ${this.throwOutDistance * this.throwOutFactor}`);
        return this.throwOutDistance * this.throwOutFactor;
      }
    };
  }

  /**
   * Initializes sounds
   */
  private initializeSounds() {
    LogService.trace(`CardsComponent#initializeSounds`);

    this.timerAlarm = new Audio();
    this.timerAlarm.src = '../../../../assets/sounds/enough.mp3';
    this.timerAlarm.load();
  }

  //
  // Find
  //

  /**
   * Finds entities by a given ID
   * @param id ID
   */
  private findEntities(id: string) {
    LogService.trace(`CardsComponent#findEntities ${id}`);
    this.stacksPersistenceService.findStackByID(this.id);
  }

  /**
   * Finds settings
   */
  private findSettings() {
    LogService.trace(`CardsComponent#findSettings`);
    this.settingsService.fetch();
  }

  /**
   * Initializes material colors and icons
   */
  private initializeMaterial() {
    LogService.trace(`CardsComponent#initializeMaterial`);
    this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
  }

  /**
   * Initializes media subscription
   */
  private initializeMediaSubscription() {
    LogService.trace(`CardsComponent#initializeMediaSubscription`);
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value as Media;
      this.initializeThrowOutFactor();
      this.initializeStackConfig();
    });
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    LogService.trace(`CardsComponent#onMenuItemClicked ${menuItem}`);
    switch (menuItem) {
      case 'back': {
        switch (GamesService.getGameModeByStack(this.stack)) {
          case GameMode.SINGLE_PLAYER: {
            this.handleBackAction();
            break;
          }
          case GameMode.MULTI_PLAYER: {
            this.handleBackActionWithConfirmation();
            break;
          }
        }
        break;
      }
      case 'sort-cards': {
        this.sortCards(this.stack).then();
        break;
      }
      case 'shuffle-cards': {
        this.shuffleCards(this.stack).then();
        break;
      }
      case 'manual': {
        this.http.get('assets/manual/manual-de.md').subscribe(
          () => {
          }, err => {
            const dialogRef = this.dialog.open(CheckableInformationDialogComponent, {
              disableClose: false,
              data: {
                title: 'Anleitung',
                text: JSON.stringify(err.error.text)
                  .replace(/"/g, '')
                  .replace(/\\n/g, '\n')
                  .replace(/\\r/g, '\r'),
                checkboxValue: this.dontShowManualOnStartup,
                checkboxText: 'Anleitung beim Starten nicht mehr anzeigen',
                action: 'Alles klar'
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result != null) {
                this.dontShowManualOnStartup = result.checkboxValue as boolean;
                this.settingsService.updateSetting(
                  new Setting(SettingType.DONT_SHOW_MANUAL_ON_STARTUP, this.dontShowManualOnStartup),
                  false);
              }
            });
          });
        break;
      }
      case 'open-source': {
        this.dialog.open(InformationDialogComponent, {
          disableClose: false,
          data: {
            title: 'Open Source Komponenten',
            text: Object.keys(environment.DEPENDENCIES).map(key => {
              return `${key} ${environment.DEPENDENCIES[key]}`;
            }).concat('---').concat(Object.keys(environment.DEV_DEPENDENCIES).map(key => {
              return `${key} ${environment.DEV_DEPENDENCIES[key]}`;
            })).join('<br/>'),
            action: 'Alles klar',
            value: null
          }
        });
        break;
      }
      case 'about': {
        this.dialog.open(AboutDialogComponent, {
          disableClose: false,
          data: {
            themeClass: this.theme,
            title: 'Über die App',
            name: environment.APP_NAME,
            version: environment.VERSION,
            authorOriginal: environment.AUTHOR_ORIGINAL,
            authorCode: environment.AUTHOR_CODE,
            authorCodeUrl: environment.AUTHOR_CODE_URL,
            authorContent: environment.AUTHOR_CONTENT,
            authorGraphics: environment.AUTHOR_GRAPHICS,
            authorGraphicsUrl: environment.AUTHOR_GRAPHICS_URL,
            authorScientificSupervision: environment.AUTHOR_SCIENTIFIC_SUPERVISION,
            githubUrl: environment.GITHUB_URL,
            licenseCode: environment.LICENSE_CODE,
            licenseContent: environment.LICENSE_CONTENT,
            homepage: environment.HOMEPAGE,
            variant: this.variant
          }
        });
        break;
      }
    }
  }

  /**
   * Handles timer running out
   */
  onTimerOver() {
    LogService.trace(`CardsComponent#onTimerOver`);
    // Check if timer is over during cards state
    if (this.game.turn.state === TurnState.DISPLAY_CARDS) {
      this.snackbarService.showSnackbar('Zeit ist abgelaufen');
      this.timerOver = true;

      if (this.game.useAlarm) {
        this.timerAlarm.play();
      }
    } else {
      this.timerStartTime = null;
    }
  }

  //

  /**
   * Handles click on display team
   */
  onDisplayTeamClicked() {
    LogService.trace(`CardsComponent#onDisplayTeamClicked ${this.stack.cards.length}`);

    // Count cards by difficulty
    const easyCardsInStack = this.cards.filter(CardsService.isCardPartOfStack).filter(CardsService.isEasy).length > 0;
    const mediumCardsInStack = this.cards.filter(CardsService.isCardPartOfStack).filter(CardsService.isMedium).length > 0;
    const hardCardsInStack = this.cards.filter(CardsService.isCardPartOfStack).filter(CardsService.isHard).length > 0;

    // Count how many different difficulties the stack contains
    let difficultyCount = 0;
    difficultyCount += (easyCardsInStack) ? 1 : 0;
    difficultyCount += (mediumCardsInStack) ? 1 : 0;
    difficultyCount += (hardCardsInStack) ? 1 : 0;

    // Check if more than one kind of difficulty is contained in stack
    if (difficultyCount > 1) {
      // Show difficulty selection
      this.gamesService.showDifficultySelection(this.game).then(() => {
      });
    } else {
      // Skip difficulty selection and continue

      let difficulty = 0;
      if (easyCardsInStack) {
        difficulty = 1;
      }
      if (mediumCardsInStack) {
        difficulty = 2;
      }
      if (hardCardsInStack) {
        difficulty = 3;
      }

      this.onDifficultySelected(difficulty);
    }
  }

  /**
   * Handles difficulty selection
   * @param difficulty difficulty
   */
  onDifficultySelected(difficulty: number) {
    LogService.trace(`CardsComponent#onDifficultySelected ${this.stack.cards.length}`);

    this.cardsService.moveCardWithSpecificDifficultyToTop(this.stack, difficulty).then((resolve) => {
      if (resolve != null) {
        const stack = resolve as Stack;

        this.stack = stack;
        this.cards = stack.cards;
        this.gamesService.showCard(this.game, difficulty).then(() => {
          // Set timer
          this.timerOver = false;
          this.timerStartTime = new Date();
          switch (difficulty) {
            case 1: {
              this.timerDuration = environment.TIMER_EASY / 60;
              break;
            }
            case 2: {
              this.timerDuration = environment.TIMER_MEDIUM / 60;
              break;
            }
            case 3: {
              this.timerDuration = environment.TIMER_HARD / 60;
              break;
            }
          }
        });
      }
    });
  }

  /**
   * Handles moving item
   * @param element element
   * @param x x value
   * @param y y value
   * @param r degrees
   */
  onItemMove(element, x, y, r) {
    element.style.transform = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r * this.throwOutRotation}deg)`;
    element.style.opacity = 1 - (1.2 * (Math.abs(x) / this.throwOutDistance));
  }

  /**
   * Handles throw out of a card
   * @param event throw event
   */
  onCardThrownOut(event: ThrowEvent) {
    switch (GamesService.getGameModeByStack(this.stack)) {
      case GameMode.SINGLE_PLAYER: {
        this.cardsService.putCardToEnd(this.stack, this.cards[0]).then((stack) => {
          this.updateCard(this.stack, this.cards[0]).then(() => {
            this.snackbarService.showSnackbar('Karte ans Ende gelegt');
          }, () => {
            this.snackbarService.showSnackbar('Karte ans Ende gelegt');
            this.initializeStack(stack).then();
          });
        });
        break;
      }
      case GameMode.MULTI_PLAYER: {
        // Deactivate timer
        this.timerStartTime = null;

        // Evaluate turn
        this.gamesService.showTurnEvaluation(this.game).then(() => {
        });
        break;
      }
    }
  }

  /**
   * Handles end of throw out card
   * @param event throw event
   */
  onCardThrownOutEnd(event: ThrowEvent) {
    setTimeout(() => {
      if (this.gameMode === GameMode.SINGLE_PLAYER) {
        this.swingStack.stack.getCard(event.target).throwIn(0, 0);
      }
    }, 100);
  }

  /**
   * Handles selection of successful team
   * @param teamID team ID
   */
  onSuccessfulTeamSelected(teamID: number) {
    LogService.trace(`CardsComponent#onSuccessfulTeamSelected ${this.stack.cards.length}`);

    this.gamesService.evaluateTurn(this.game, teamID, this.cards[0].difficulty).then(() => {
      this.cardsService.putCardAway(this.stack, this.stack.cards[0]).then();
      this.stacksPersistenceService.updateStack(this.stack).then(() => {
      }, () => {
      });
    });
  }

  /**
   * Handles click on score overview
   */
  onDisplayScoreOverviewClicked() {
    LogService.trace(`CardsComponent#onDisplayScoreOverviewClicked ${this.stack.cards.length}`);
    this.winningTeams = GamesService.determineWinningTeams(this.game);
    this.gamesService.closeTurn(this.stack.cards.filter(CardsService.isCardPartOfStack), this.game).then();
  }

  //
  // Helpers
  //

  /**
   * Handles back action
   */
  private handleBackActionWithConfirmation() {
    LogService.trace(`CardsComponent#handleBackActionWithConfirmation`);
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      data: {
        title: 'Spiel beenden',
        text: 'Willst du das Spiel beenden?',
        action: 'Ja, beenden',
        negativeAction: 'Nein, weiterspielen',
        value: {}
      }
    });
    confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
      if (confirmationResult != null) {
        this.handleBackAction();
      }
    });
  }

  /**
   * Handles back action
   */
  private handleBackAction() {
    LogService.trace(`CardsComponent#handleBackAction`);
    // Remove existing game
    this.stack.game = null;
    this.cardsService.putCardsBackToStack(this.stack).then((restoredStack) => {
      // Save stack
      this.stacksPersistenceService.updateStack(restoredStack).then(() => {
        this.navigateToGamesPage();
      }, () => {
        this.navigateToGamesPage();
      });
    });
  }

  /**
   * Updates a card
   * @param stack stack
   * @param card card
   */
  private updateCard(stack: Stack, card: Card): Promise<any> {
    LogService.trace(`CardsComponent#updateCard`);
    return new Promise((resolve, reject) => {
      this.cardsService.updateCard(stack, card).then(() => {
        this.stacksPersistenceService.clearStacks();
        this.stacksPersistenceService.updateStack(stack).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      }).catch(() => {
        reject();
      });
    });
  }

  /**
   * Sorts cards
   * @param stack stack
   */
  private sortCards(stack: Stack): Promise<any> {
    LogService.trace(`CardsComponent#sortCards`);
    return new Promise(() => {
      if (stack != null) {
        this.cardsService.sortStack(stack).then(((sortedStack) => {
          this.stacksPersistenceService.updateStack(sortedStack).then(() => {
            this.snackbarService.showSnackbar('Karten sortiert');
          }, (updatedStack) => {
            this.snackbarService.showSnackbar('Karten sortiert');
            this.initializeStack(updatedStack).then();
            this.initializeGameMode(updatedStack);
          });
        }));
      }
    });
  }

  /**
   * Shuffles cards
   * @param stack stack
   */
  private shuffleCards(stack: Stack): Promise<any> {
    LogService.trace(`CardsComponent#shuffleCards`);
    return new Promise(() => {
      if (stack != null) {
        this.cardsService.shuffleStack(stack).then(((shuffledStack) => {
          this.stacksPersistenceService.updateStack(shuffledStack).then(() => {
            this.snackbarService.showSnackbar('Karten gemischt');
          }, (updatedStack) => {
            this.snackbarService.showSnackbar('Karten gemischt');
            this.initializeStack(updatedStack).then();
            this.initializeGameMode(updatedStack);
          });
        }));
      }
    });
  }

  /**
   * Navigates back to parent view
   */
  private navigateToGamesPage() {
    LogService.trace(`CardsComponent#navigateBack`);

    this.cardsService.stack = null;

    switch (VariantService.getVariant()) {
      case Variant.SCIDDLE: {
        this.router.navigate([`/${ROUTE_GAMES}/${this.stack.id}`]).then();
        break;
      }
      case Variant.S4F: {
        LogService.trace(`CardsComponent > /${ROUTE_GAMES}`);
        this.router.navigate([`/${ROUTE_GAMES}`]).then();
        break;
      }
    }
  }
}
