import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {GamesService} from '../../../../core/entity/services/game/games.service';
import {Stack} from '../../../../core/entity/model/stack/stack.model';
import {STACK_PERSISTENCE_POUCHDB} from '../../../../core/entity/entity.module';
import {StacksPersistenceService} from '../../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {Media} from '../../../../core/ui/model/media.enum';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MatDialog, MatIconRegistry, MatSliderChange} from '@angular/material';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {Animations, TeamCountSelectionState} from './games.animation';
import {HttpClient} from '@angular/common/http';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {ROUTE_CARDS, ROUTE_STACKS} from '../../../../app.routes';
import {ThemeService} from '../../../../core/ui/services/theme.service';
import {Theme} from '../../../../core/ui/model/theme.enum';
import {OverlayContainer} from '@angular/cdk/overlay';

/**
 * Displays games page
 */
@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  animations: [
    Animations.teamCountSelectionAnimation,
  ]
})
export class GamesComponent implements OnInit, AfterViewInit, OnDestroy {

  /** App title */
  public title = environment.APP_NAME;

  /** ID passed as an argument */
  public id: string;
  /** Stack */
  public stack: Stack;

  /** Selected time limit mode */
  public useTimeLimit = false;
  /** Selected team count */
  public teamCount = -1;
  /** Selected difficulty easy */
  public difficultyEasy = false;
  /** Selected difficulty medium */
  public difficultyMedium = false;
  /** Selected difficulty hard */
  public difficultyHard = false;
  /** Selected card count */
  public cardCount = 0;

  /** Minimum card count */
  public minCardCount = environment.MIN_CARDS;
  /** Maximum card count */
  public maxCardCount;

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Scroll state */
  public teamCountSelectionState: TeamCountSelectionState = TeamCountSelectionState.DEACTIVATED;

  /**
   * Constructor
   * @param cardsService cards service
   * @param dialog dialog
   * @param gameService games service
   * @param http http client
   * @param iconRegistry iconRegistry
   * @param mediaService media service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param overlayContainer overlay container
   * @param route route
   * @param router router
   * @param sanitizer sanitizer
   * @param snackbarService snackbar service
   * @param stacksPersistenceService stacks persistence service
   * @param themeService theme service
   */
  constructor(private cardsService: CardsService,
              public dialog: MatDialog,
              private gameService: GamesService,
              private http: HttpClient,
              private iconRegistry: MatIconRegistry,
              private mediaService: MediaService,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private overlayContainer: OverlayContainer,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private snackbarService: SnackbarService,
              @Inject(STACK_PERSISTENCE_POUCHDB) private stacksPersistenceService: StacksPersistenceService,
              private themeService: ThemeService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeStackSubscription();

    this.initializeMaterial();
    this.initializeMediaSubscription();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit() {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');

      // Try to load existing stack
      if (this.id != null) {
        this.findEntities(this.id);
      } else {
        this.navigateBack();
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
      } else {
        this.navigateBack();
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

    this.cardCount = Math.round(environment.MIN_CARDS + ((stack.cards.length - environment.MIN_CARDS) / 2));
    this.maxCardCount = stack.cards.length;

    this.initializeTitle(stack);
    this.initializeTheme(stack);
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
    this.title = stack != null && stack.title != null ? stack.title : this.title;
  }

  /**
   * Initializes Theme
   * @param stack stack
   */
  private initializeTheme(stack: Stack) {
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
        this.themeService.switchTheme(Theme.BLUE);
        break;
      }
    }
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
        this.router.navigate([`/${ROUTE_STACKS}`]).then(() => {
        });
        break;
      }
      case 'manual': {
        this.http.get('assets/manual/manual-de.md').subscribe(
          () => {
          }, err => {
            this.dialog.open(InformationDialogComponent, {
              disableClose: false,
              data: {
                title: 'Anleitung',
                text: JSON.stringify(err.error.text)
                  .replace(/"/g, '')
                  .replace(/\\n/g, '\n')
                  .replace(/\\r/g, '\r'),
                action: 'Alles klar',
                value: null
              }
            });
          });
        break;
      }
      case 'opensource': {
        this.http.get('assets/open-source/open-source.md').subscribe(
          () => {
          }, err => {
            this.dialog.open(InformationDialogComponent, {
              disableClose: false,
              data: {
                title: 'Open Source Komponenten',
                text: JSON.stringify(err.error.text)
                  .replace(/"/g, '')
                  .replace(/\\n/g, '\n')
                  .replace(/\\r/g, '\r'),
                action: 'Alles klar',
                value: null
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

  /**
   * Handles click on single-player button
   */
  onSinglePlayerClicked() {
    this.gameService.initializeSinglePlayerGame(this.stack).then(() => {
      this.cardsService.shuffleStack(this.stack).then();
      this.stacksPersistenceService.updateStack(this.stack).then(() => {
        this.router.navigate([`/${ROUTE_CARDS}/${this.stack.id}`]).then();
      });
    });
  }

  /**
   * Handles click on multi-player button
   */
  onMultiPlayerClicked() {
    if (this.teamCountSelectionState === TeamCountSelectionState.DEACTIVATED) {
      this.teamCountSelectionState = TeamCountSelectionState.ACTIVATED;
    } else {
      this.teamCountSelectionState = TeamCountSelectionState.DEACTIVATED;
    }
  }

  /**
   * Toggles usage of time limit
   */
  onTimeLimitToggled() {
    this.useTimeLimit = !this.useTimeLimit;
  }

  /**
   * Handles selection of team count
   * @param teamCount number of teams
   */
  onTeamCountSelected(teamCount: number) {
    this.teamCount = teamCount;
  }

  /**
   * Handles difficulty selection
   * @param event event
   */
  onDifficultySelected(event: { difficulty: number, selected: boolean }) {
    switch (event.difficulty) {
      case 1: {
        this.difficultyEasy = event.selected;
        break;
      }
      case 2: {
        this.difficultyMedium = event.selected;
        break;
      }
      case 3: {
        this.difficultyHard = event.selected;
        break;
      }
    }
  }

  /**
   * Handles card count change
   * @param event event
   */
  onCardCountChanged(event: MatSliderChange) {
    this.cardCount = event.value;
  }

  /**
   * Starts a multi-player game
   */
  onStartMultiPlayerGameClicked() {
    this.gameService.initializeMultiPlayerGame(this.stack, this.teamCount, this.useTimeLimit,
      this.difficultyEasy, this.difficultyMedium, this.difficultyHard, this.cardCount).then(() => {
      this.cardsService.shuffleStack(this.stack).then();
      this.stacksPersistenceService.updateStack(this.stack).then(() => {
        this.router.navigate([`/${ROUTE_CARDS}/${this.stack.id}`]).then();
      });
    });
  }

  //
  // Helpers
  //

  /**
   * Generates an array of a given number of elements
   * @param n number of elements
   */
  arrayOne(n: number): any[] {
    return Array(n);
  }

  /**
   * Navigates back to parent view
   */
  private navigateBack() {
    this.router.navigate([`/${ROUTE_STACKS}`]).then();
  }
}
