import {Component, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Media} from '../../../../core/ui/model/media.enum';
import {environment} from '../../../../../environments/environment';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {takeUntil} from 'rxjs/operators';
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

export enum DisplayAspect {
  DISPLAY_CARDS,
  DISPLAY_TEAM,
  DISPLAY_DIFFICULTY_SELECTION,
}

/**
 * Displays card component
 */
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {

  /** App title */
  public title = environment.APP_NAME;

  /** ID passed as an argument */
  public id: string;
  /** Stack */
  public stack: Stack;
  /** Array of cards */
  public cards: Card[] = [];

  /** Array of easy cards */
  public cardsEasy: Card[] = [];
  /** Array of medium cards */
  public cardsMedium: Card[] = [];
  /** Array of hard cards */
  public cardsHard: Card[] = [];

  /** Game */
  public game: Game;
  /** Game mode */
  public gameMode: GameMode;

  /** Current display aspect */
  public displayAspect: DisplayAspect;
  /** Enum of display aspect types */
  public displayAspectType = DisplayAspect;

  /** Title color */
  public titleColor = 'black';
  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Swing stack control */
  @ViewChild('swingStack') swingStack: SwingStackComponent;
  /** Swing cards control */
  @ViewChildren('swingCards') swingCards: QueryList<SwingCardComponent>;

  /** Stack configuration */
  stackConfig: StackConfig;

  /** Number of pixels the card needs to be moved before it counts as swiped */
  private throwOutDistance = 800;

  /**
   * Constructor
   * @param cardsService cards service
   * @param dialog dialog
   * @param gamesService games service
   * @param iconRegistry iconRegistry
   * @param mediaService media service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param route route
   * @param router router
   * @param sanitizer sanitizer
   * @param snackbarService snackbar service
   * @param stacksPersistenceService stacks persistence service
   */
  constructor(private cardsService: CardsService,
              public dialog: MatDialog,
              private gamesService: GamesService,
              private iconRegistry: MatIconRegistry,
              private mediaService: MediaService,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private snackbarService: SnackbarService,
              @Inject(STACK_PERSISTENCE_POUCHDB) private stacksPersistenceService: StacksPersistenceService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeStackSubscription();
    this.initializeCardSubscription();

    this.initializeGameSubscription();

    this.initializeColors();
    this.initializeMaterial();
    this.initializeMediaSubscription();

    this.initializeStackConfig();

    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');

      // Try to load existing stack
      if (this.id != null) {
        this.findEntities(this.id);
      }
    });
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
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
    this.stacksPersistenceService.stackSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const stack = value as Stack;
        this.initializeStack(stack);
        this.initializeGameMode(stack);
      } else {
        this.initializeEmptyStack();
      }
    });
  }

  /**
   * Initializes card subscription
   */
  private initializeCardSubscription() {
    this.cardsService.cardsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeCards(value as Card[]);
      }
    });
  }

  /**
   * Initializes turn subscription
   */
  private initializeGameSubscription() {
    this.gamesService.gameSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeGame(value as Game);
      }
    });
  }

  // Stack

  /**
   * Initializes stack
   * @param stack stack
   */
  private initializeStack(stack: Stack) {
    this.stack = stack;

    this.initializeTitle(stack);
    this.cardsService.initializeCards(stack.cards);
    this.gamesService.initializeGame(stack.game);
  }

  /**
   * Initializes empty stack
   */
  private initializeEmptyStack() {
    const stack = new Stack();
    stack.id = '0';
    this.stacksPersistenceService.createStack(stack).then(() => {
    });
  }

  // Cards

  /**
   * Initializes cards by filtering them
   * @param cards cards
   */
  private initializeCards(cards: Card[]) {

    // Filter and sort cards
    this.cards = cards.filter(CardsService.isCardPartOfStack).sort(CardsService.sortCards);

    this.cardsEasy = this.cards.filter(CardsService.isEasy);
    this.cardsMedium = this.cards.filter(CardsService.isMedium);
    this.cardsHard = this.cards.filter(CardsService.isHard);
  }

  // Game

  /**
   * Initializes game
   * @param game game
   */
  private initializeGame(game: Game) {
    this.game = game;
    console.log(`game ${JSON.stringify(game)}`);

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
              this.stacksPersistenceService.updateStack(this.stack).then(() => {
                this.snackbarService.showSnackbar('Spiel gestarted');
              });
            });
            break;
          case GameState.ONGOING: {
            // Conduct turn
            switch (game.turn.state) {
              case TurnState.UNINIZIALIZED: {
                console.log(`TurnState.UNINIZIALIZED`);
                this.gamesService.startTurn(this.game).then(() => {
                  this.stacksPersistenceService.updateStack(this.stack).then(() => {
                    this.snackbarService.showSnackbar('Runde gestarted');
                  });
                });
                break;
              }
              case TurnState.DISPLAY_TEAM_TAKING_TURN: {
                console.log(`TurnState.DISPLAY_TEAM_TAKING_TURN`);
                this.displayAspect = DisplayAspect.DISPLAY_TEAM;
                break;
              }
              case TurnState.SELECT_DIFFICULTY: {
                console.log(`TurnState.DISPLAY_DIFFICULTY_SELECTION`);
                this.displayAspect = DisplayAspect.DISPLAY_DIFFICULTY_SELECTION;
                break;
              }
              case TurnState.DISPLAY_CARD: {
                break;
              }
              case TurnState.DISPLAY_OUTCOMES: {
                break;
              }
            }

            break;
          }
          case GameState.FINISHED: {
            // Finish game
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
    this.gameMode = GamesService.getGameModeByStack(stack);
  }

  // Others

  /**
   * Finds entities by a given ID
   * @param id ID
   */
  private findEntities(id: string) {
    if (id != null) {
      this.stacksPersistenceService.findStackByID(this.id);
    }
  }

  /**
   * Initializes colors
   */
  private initializeColors() {
    this.titleColor = this.materialColorService.primary;
  }

  /**
   * Initializes material colors and icons
   */
  private initializeMaterial() {
    this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
  }

  /**
   * Initializes media subscription
   */
  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value as Media;
    });
  }

  /**
   * Initializes title
   * @param stack stack
   */
  private initializeTitle(stack: Stack) {
    // this.title = stack != null && stack.title != null ? stack.title : this.title;
  }

  /**
   * Initializes stack config
   */
  private initializeStackConfig() {
    this.stackConfig = {
      allowedDirections: [Direction.LEFT, Direction.RIGHT],
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth / 2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: () => {
        return this.throwOutDistance;
      }
    };
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
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
      case 'shuffle-cards': {
        this.shuffleCards().then(() => {
        });
        break;
      }
      case 'about': {
        this.dialog.open(AboutDialogComponent, {
          disableClose: false,
          data: {
            title: 'Über die App',
            name: environment.NAME,
            version: environment.VERSION,
            authorCode: environment.AUTHOR_CODE,
            authorContent: environment.AUTHOR_CONTENT,
            licenseCode: environment.LICENSE_CODE,
            licenseContent: environment.LICENSE_CONTENT,
            homepage: environment.HOMEPAGE,
          }
        });
        break;
      }
    }
  }

  //

  /**
   * Handles click on display team
   */
  onDisplayTeamClicked() {
    this.gamesService.showDifficultySelection(this.game);
  }

  /**
   * Handles difficulty selection
   * @param difficulty difficulty
   */
  onDifficultySelected(difficulty: number) {
  }

  /**
   * Handles moving item
   * @param element element
   * @param x x value
   * @param y y value
   * @param r degrees
   */
  onItemMove(element, x, y, r) {
    element.style.transform = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
    element.style.opacity = 1 - (1.2 * (Math.abs(x) / this.throwOutDistance));
  }

  /**
   * Handles throw out of a card
   * @param event throw event
   */
  onCardThrownOut(event: ThrowEvent) {
    switch (GamesService.getGameModeByStack(this.stack)) {
      case GameMode.SINGLE_PLAYER: {
        this.cardsService.putCardToEnd(this.stack, this.cards[0]).then(() => {
          this.updateCard(this.stack, this.cards[0]).then(() => {
            this.snackbarService.showSnackbar('Karte ans Ende gelegt');
          });
        });
        break;
      }
      case GameMode.MULTI_PLAYER: {
        this.cardsService.putCardAway(this.stack, this.cards[0]).then(() => {
          this.updateCard(this.stack, this.cards[0]).then(() => {
            this.snackbarService.showSnackbar('Karte weggelegt');
          });
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
      this.swingStack.stack.getCard(event.target).throwIn(0, 0);
    }, 100);
  }

  //
  // Helpers
  //

  /**
   * Handles back action
   */
  private handleBackActionWithConfirmation() {
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
    // Remove existing game
    this.stack.game = null;

    // Save stack
    this.stacksPersistenceService.updateStack(this.stack).then(() => {
      // Navigate to game page
      this.router.navigate([`/games/${this.stack.id}`]).then();
    });
  }

  /**
   * Updates a card
   * @param stack stack
   * @param card card
   */
  private updateCard(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cardsService.updateCard(stack, card).then(() => {
        this.stacksPersistenceService.clearStacks();
        this.stacksPersistenceService.updateStack(stack).then(() => {
          resolve();
        }).catch(err => {
          console.error(err);
          reject();
        });
      }).catch(err => {
        console.error(err);
        reject();
      });
    });
  }

  /**
   * Shuffles cards
   */
  private shuffleCards(): Promise<any> {
    return new Promise(() => {
      this.cardsService.shuffleStack(this.stack).then((() => {
        this.stacksPersistenceService.updateStack(this.stack).then(() => {
          this.snackbarService.showSnackbar('Karten gemischt');
        });
      }));
    });
  }
}
