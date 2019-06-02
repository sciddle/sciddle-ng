import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {GamesService} from '../../../../core/entity/services/game/games.service';
import {Stack} from '../../../../core/entity/model/stack/stack.model';
import {STACK_PERSISTENCE_POUCHDB} from '../../../../core/entity/entity.module';
import {StacksPersistenceService} from '../../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {CardsAssetsService} from '../../../../core/entity/services/card/cards-assets.service';
import {Card} from '../../../../core/entity/model/card/card.model';
import {environment} from '../../../../../environments/environment';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {Media} from '../../../../core/ui/model/media.enum';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {Animations, TeamCountSelectionState} from './games.animation';

/**
 * Displays games page
 */
@Component({
  selector: 'app-welcome',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  animations: [
    Animations.teamCountSelectionAnimation,
  ]
})
export class GamesComponent implements OnInit, OnDestroy {

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

  /** Title color */
  public titleColor = 'black';
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
              private gameService: GamesService,
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

    this.initializeColors();
    this.initializeMaterial();
    this.initializeMediaSubscription();

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
      } else {
        this.initializeEmptyStack();
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
  }

  /**
   * Initializes cards
   * @param stack stack
   */
  private initializeCards(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      this.cardsService.clearCards();
      this.cardsService.mergeCardsFromAssets(CardsAssetsService.getAssetsCards()).then(resolvedCards => {
        this.stack.cards = resolvedCards as Card[];
        this.stacksPersistenceService.updateStack(this.stack).then(() => {
        });
        this.snackbarService.showSnackbar('Neue Karten geladen');
        resolve();
      }, () => {
        // Do nothing
        resolve();
      });
    });
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

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
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
      this.initializeCards(this.stack).then(() => {
        this.cardsService.shuffleStack(this.stack);
        this.stacksPersistenceService.updateStack(this.stack).then(() => {
          this.router.navigate([`/cards/${this.stack.id}`]).then(() => {
          });
        });
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
   * Starts a multi-player game
   */
  onStartMultiPlayerGameClicked() {
    this.gameService.initializeMultiPlayerGame(this.stack, this.teamCount, this.useTimeLimit).then(() => {
      this.initializeCards(this.stack).then(() => {
        this.cardsService.shuffleStack(this.stack);
        this.stacksPersistenceService.updateStack(this.stack).then(() => {
          this.router.navigate([`/cards/${this.stack.id}`]).then(() => {
          });
        });
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
}
