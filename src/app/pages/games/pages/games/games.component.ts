import {OverlayContainer} from '@angular/cdk/overlay';
import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import {ROUTE_CARDS, ROUTE_STACKS} from '../../../../app.routes';
import {STACK_PERSISTENCE_POUCHDB} from '../../../../core/entity/entity.module';
import {Game} from '../../../../core/entity/model/game/game.model';
import {Stack} from '../../../../core/entity/model/stack/stack.model';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {GamesService} from '../../../../core/entity/services/game/games.service';
import {
  StacksPersistenceService
} from '../../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {StacksService} from '../../../../core/entity/services/stack/stacks.service';
import {LogService} from '../../../../core/log/services/log.service';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {Setting} from '../../../../core/settings/model/setting.model';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {Media} from '../../../../core/ui/model/media.enum';
import {Theme} from '../../../../core/ui/model/theme.enum';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {ThemeService} from '../../../../core/ui/services/theme.service';
import {Variant} from '../../../../core/util/model/variant.enum';
import {VariantService} from '../../../../core/util/services/variant.service';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
// tslint:disable-next-line:max-line-length
import {
  MultiplayerGameDialogComponent
} from '../../components/dialogs/multiplayer-game-dialog/multiplayer-game-dialog.component';
import {ManualDialogComponent} from "../../../../ui/manual-dialog/manual-dialog/manual-dialog.component";
import {
  OpenSourceDialogComponent
} from "../../../../ui/open-source-dialog/open-source-dialog/open-source-dialog.component";

/**
 * Displays games page
 */
@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GamesComponent implements OnInit, AfterViewInit, OnDestroy {

  /** App title */
  public title = environment.APP_NAME;

  /** ID passed as an argument */
  public id: string;
  /** Stack */
  public stack: Stack;

  /** Map of settings */
  public settingsMap = new Map<string, Setting>();
  /** Setting dont-show-manual-on-startup */
  public dontShowManualOnStartup = false;

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
  /** Current theme */
  public theme: Theme = Theme.BLUE;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** App variant */
  public variant = environment.VARIANT;

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
   * @param settingsService settings service
   * @param snackbarService snackbar service
   * @param stacksPersistenceService stacks persistence service
   * @param stacksService stacks service
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
              private settingsService: SettingsService,
              private snackbarService: SnackbarService,
              @Inject(STACK_PERSISTENCE_POUCHDB) private stacksPersistenceService: StacksPersistenceService,
              private stacksService: StacksService,
              private themeService: ThemeService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  public ngOnInit() {
    this.initializeStackSubscription();
    this.initializeSettingsSubscription();
    this.initializeDatabaseErrorSubscription();

    this.initializeMaterial();
    this.initializeMediaSubscription();
    this.initializeThemeSubscription();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  public ngAfterViewInit() {
    // Try to load existing stack
    switch (VariantService.getVariant()) {
      case Variant.SCIDDLE: {
        this.route.params.subscribe(() => {
          this.id = this.route.snapshot.paramMap.get('id');
          if (this.id != null) {
            this.findEntities(this.id);
          } else {
            this.navigate(`/${ROUTE_STACKS}`);
          }
        });
        break;
      }
      case Variant.S4F: {
        this.findEntities(environment.DEFAULT_STACK.toString());
        break;
      }
    }

    this.findSettings();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  public ngOnDestroy() {
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
    LogService.trace(`GamesComponent#initializeStackSubscription`);
    this.stacksPersistenceService.stackSubject.pipe(
      takeUntil(this.unsubscribeSubject),
    ).subscribe((value) => {
      LogService.debug(`GamesComponent > STACK`);

      if (value != null) {
        LogService.debug(`GamesComponent value != null`);
        const stack = value as Stack;
        this.mergeStacksFromAssets(stack).then((mergedStack) => {
          this.initializeStack(mergedStack).then((initializedStack) => {
            this.stack = initializedStack;
          });
        });

        switch (VariantService.getVariant()) {
          case Variant.SCIDDLE: {
            break;
          }
          case Variant.S4F: {
            this.initializeUninitializedStack(stack);
            break;
          }
        }
      } else {
        LogService.debug(`GamesComponent value == null`);

        switch (VariantService.getVariant()) {
          case Variant.SCIDDLE: {
            this.navigate(`/${ROUTE_STACKS}`);
            break;
          }
          case Variant.S4F: {
            const stack = new Stack();
            stack.id = environment.DEFAULT_STACK.toString();
            this.mergeStacksFromAssets(stack).then((mergedStack) => {
              this.initializeStack(mergedStack).then((initializedStack) => {
                this.stack = initializedStack;
              });
            });
            break;
          }
        }
      }
    });
  }

  /**
   * Initializes settings subscription
   */
  private initializeSettingsSubscription() {
    this.settingsService.settingsSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter((value) => value != null),
    ).subscribe((value) => {
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
    this.stacksPersistenceService.databaseErrorSubject.pipe(
      takeUntil(this.unsubscribeSubject),
    ).subscribe((value) => {
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

        if (this.cardsService.stack != null) {
          // Load cards and game stored in service
          LogService.debug(`Load stack and game stored in services`);
          stack = this.cardsService.stack;

          this.initializeStack(stack).then((initializedStack) => {
            this.stack = initializedStack;
          });
        } else {
          // Load cards from assets
          LogService.debug(`Load cards from assets`);

          if (stack.id == null) {
            this.navigate(`/${ROUTE_STACKS}`);
          }

          let fileName;
          fileName = StacksService.stacks.get(stack.id);

          this.stacksService.getStackFromAssets(fileName).then((stackFromAssets) => {
            if (stackFromAssets != null) {
              stack = stackFromAssets;
              stack.game = new Game();
            }

            this.initializeStack(stack).then((initializedStack) => {
              this.stack = initializedStack;

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
    LogService.trace(`GamesComponent#initializeStack`);
    return new Promise((resolve) => {
      if (stack != null) {
        this.initializeCards(stack);
        this.initializeCardCount(stack);
        this.initializeTitle(stack);
        this.initializeTheme(stack);
      }

      resolve(stack);
    });
  }

  /**
   * Initializes cards
   * @param stack stack
   */
  private initializeCards(stack: Stack) {
    LogService.trace(`GamesComponent#initializeCards`);
    stack.cards.forEach((card, index) => {
      card.index = index;
    });
  }

  /**
   * Initializes card count
   * @param stack stack
   */
  private initializeCardCount(stack: Stack) {
    LogService.trace(`GamesComponent#initializeCardCount`);
    this.cardCount = Math.round(environment.MIN_CARDS + ((stack.cards.length - environment.MIN_CARDS) / 2));
    this.maxCardCount = stack.cards.length;
  }

  /**
   * Initializes title
   * @param stack stack
   */
  private initializeTitle(stack: Stack) {
    LogService.trace(`GamesComponent#initializeTitle`);
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
    LogService.trace(`GamesComponent#initializeTheme`);
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
      case 'kult': {
        this.themeService.switchTheme(Theme.KULT);
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
   * Initializes stacks
   * @param stack stack
   */
  private mergeStacksFromAssets(stack: Stack): Promise<Stack> {
    LogService.trace(`GamesComponent#mergeStacksFromAssets`);

    return new Promise((resolve) => {
      this.stacksService.mergeStackFromAssets(stack).then((result) => {
        const mergedStack = result as Stack;
        this.stacksPersistenceService.updateStackWithoutNotification(mergedStack).then((updatedStack) => {
          this.snackbarService.showSnackbar('Neue Karten geladen');
          resolve(updatedStack);
        }, (updatedStack) => {
          resolve(updatedStack);
        });
      }, () => {
        resolve(stack);
      });
    });
  }

  /**
   * Initializes uninitialized stack
   * @param stack existing stack
   */
  private initializeUninitializedStack(stack: Stack) {
    StacksService.getUninitializedDefaultStackIDs([stack]).forEach((stackID) => {
      const s = new Stack();
      s.id = stackID;
      this.stacksPersistenceService.createStack(s).then();
    });
  }

  // Settings

  /**
   * Initializes settings
   * @param settingsMap settings map
   */
  private initializeSettings(settingsMap: Map<string, Setting>) {
    this.settingsMap = new Map(settingsMap);
    this.dontShowManualOnStartup = SettingsService.isSettingActive(SettingType.DONT_SHOW_MANUAL_ON_STARTUP, this.settingsMap);

    if (this.dontShowManualOnStartup !== null && this.dontShowManualOnStartup === false) {
      this.onMenuItemClicked('manual');
    }
  }

  // Others

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
      takeUntil(this.unsubscribeSubject),
    ).subscribe((value) => {
      this.media = value as Media;
    });
  }

  /**
   * Initializes theme subscription
   */
  private initializeThemeSubscription() {
    this.theme = this.themeService.theme;
    this.themeService.themeSubject.pipe(
      takeUntil(this.unsubscribeSubject),
    ).subscribe((value) => {
      this.theme = value as Theme;
    });
  }

  //
  // Find
  //

  /**
   * Finds entities by a given ID
   * @param id ID
   */
  private findEntities(id: string) {
    this.stacksPersistenceService.findStackByID(id);
  }

  /**
   * Finds settings
   */
  private findSettings() {
    this.settingsService.fetch();
  }

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  public onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'back': {
        this.navigate(`/${ROUTE_STACKS}`);
        break;
      }
      case 'manual': {
        this.dialog.open(ManualDialogComponent).afterClosed().subscribe((result) => {
          if (result != null) {
            this.dontShowManualOnStartup = result.checkboxValue as boolean;
            this.settingsService.updateSetting(
              new Setting(SettingType.DONT_SHOW_MANUAL_ON_STARTUP, this.dontShowManualOnStartup),
              false);
          }
        });
        break;
      }
      case 'open-source': {
        this.dialog.open(OpenSourceDialogComponent);
        break;
      }
      case 'about': {
        this.dialog.open(AboutDialogComponent);
        break;
      }
    }
  }

  /**
   * Handles click on single-player button
   */
  public onSinglePlayerClicked() {
    this.gameService.initializeSinglePlayerGame(this.stack).then((initializedStack) => {
      this.cardsService.shuffleStack(initializedStack).then((shuffledStack) => {
        this.stacksPersistenceService.updateStack(shuffledStack).then((updatedStack) => {
          this.navigateToCardsPage(updatedStack);
        }, (updatedStack) => {
          this.navigateToCardsPage(updatedStack);
        });
      });
    });
  }

  /**
   * Handles click on multi-player button
   */
  public onMultiPlayerClicked() {
    const multiplayerGameDialogRef = this.dialog.open(MultiplayerGameDialogComponent, {
      disableClose: false,
      data: {
        cardCount: this.cardCount,
        minCardCount: this.minCardCount,
        maxCardCount: this.maxCardCount,
      },
      autoFocus: false,
    });

    multiplayerGameDialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.gameService.initializeMultiPlayerGame(
          this.stack,
          result.teamCount,
          result.useTimeLimit,
          result.useAlarm,
          result.difficultyEasy,
          result.difficultyMedium,
          result.difficultyHard,
          result.cardCount).then((initializedStack) => {

          this.stacksPersistenceService.updateStackWithoutNotification(initializedStack).then((updatedStack) => {
            this.navigateToCardsPage(updatedStack);
          }, (updatedStack) => {
            this.navigateToCardsPage(updatedStack);
          });
        });
      }
    });
  }

  //
  // Helpers
  //

  /**
   * Navigates to cards page
   * @param stack stack
   */
  private navigateToCardsPage(stack: Stack) {
    switch (VariantService.getVariant()) {
      case Variant.SCIDDLE: {
        this.navigate(`/${ROUTE_CARDS}/${stack.id}`);
        break;
      }
      case Variant.S4F: {
        this.navigate(`/${ROUTE_CARDS}`);
        break;
      }
    }
  }

  /**
   * Navigates to a given path
   *
   * @param path path to navigate to
   */
  private navigate(path: string) {
    LogService.trace(`GamesComponent#navigate ${path}`);
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
    this.router.navigate([path]).then();
  }
}
