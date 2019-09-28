import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {GamesService} from '../../../../core/entity/services/game/games.service';
import {Stack} from '../../../../core/entity/model/stack/stack.model';
import {STACK_PERSISTENCE_POUCHDB} from '../../../../core/entity/entity.module';
import {StacksPersistenceService} from '../../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {filter, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {Media} from '../../../../core/ui/model/media.enum';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {HttpClient} from '@angular/common/http';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {ROUTE_CARDS, ROUTE_STACKS} from '../../../../app.routes';
import {ThemeService} from '../../../../core/ui/services/theme.service';
import {Theme} from '../../../../core/ui/model/theme.enum';
import {OverlayContainer} from '@angular/cdk/overlay';
import {MultiplayerGameDialogComponent} from '../../components/dialogs/multiplayer-game-dialog/multiplayer-game-dialog.component';
import {VariantService} from '../../../../core/util/services/variant.service';
import {Variant} from '../../../../core/util/model/variant.enum';
import {StacksService} from '../../../../core/entity/services/stack/stacks.service';
import {Setting} from '../../../../core/settings/model/setting.model';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
// tslint:disable-next-line:max-line-length
import {CheckableInformationDialogComponent} from '../../../../ui/information-dialog/checkable-information-dialog/checkable-information-dialog.component';
import {LogService} from '../../../../core/log/services/log.service';

/**
 * Displays games page
 */
@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  variant = environment.VARIANT;

  /** Caption for single player mode */
  gameModeSinglePlayer = environment.GAME_MODE_SINGLE_PLAYER;
  /** Caption for multi player mode */
  gameModeMultiPlayer = environment.GAME_MODE_MULTI_PLAYER;

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
  ngOnInit() {
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
  ngAfterViewInit() {
    // Try to load existing stack
    switch (VariantService.getVariant()) {
      case Variant.SCIDDLE: {
        this.route.params.subscribe(() => {
          this.id = this.route.snapshot.paramMap.get('id');
          if (this.id != null) {
            this.findEntities(this.id);
          } else {
            this.navigateBack();
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
    LogService.trace(`initializeStackSubscription`);
    this.stacksPersistenceService.stackSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      let stack = null;

      if (value != null) {
        stack = value as Stack;
        this.initializeStack(stack);
        this.initializeCards(stack);
        this.initializeTitle(stack);
        this.initializeTheme(stack);
        this.mergeStacksFromAssets(stack).then(() => {
          this.stacksPersistenceService.updateStackWithoutNotification(stack).then();
        });
      } else {
        this.navigateBack();
      }

      switch (VariantService.getVariant()) {
        case Variant.SCIDDLE: {
          break;
        }
        case Variant.S4F: {
          this.initializeUninitializedStack(stack);
          break;
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
      filter(value => value != null)
    ).subscribe(value => {
      if (value != null) {
        const settings = value as Map<string, Setting>;
        this.initializeSettings(settings);
      }
    });
  }

  /**
   * Initializes database error subscription
   */
  private initializeDatabaseErrorSubscription() {
    this.stacksPersistenceService.databaseErrorSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      // TODO Check error more specifically
      if (value != null) {
        const fileName = StacksService.stacks.get(environment.DEFAULT_STACK.toString());
        this.stacksService.getStackFromAssets(fileName).then(stackFromAssets => {
          if (stackFromAssets != null) {
            this.initializeStack(stackFromAssets);
            this.initializeTitle(stackFromAssets);
            this.initializeTheme(stackFromAssets);
            this.snackbarService.showSnackbar('Speicherplatz knapp. Spiel wird nicht gespeichert.');
          }
        });
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
  }

  /**
   * Initializes cards
   * @param stack stack
   */
  private initializeCards(stack: Stack) {
    stack.cards.forEach((card, index) => {
      card.index = index;
    });
  }

  /**
   * Initializes stacks
   * @param stack stack
   */
  private mergeStacksFromAssets(stack: Stack): Promise<Stack> {
    LogService.trace(`mergeStacksFromAssets`);

    return new Promise((resolve) => {
      this.stacksService.mergeStackFromAssets(stack).then(result => {
        const mergedStack = result as Stack;
        this.stacksPersistenceService.updateStackWithoutNotification(mergedStack).then(() => {
          this.snackbarService.showSnackbar('Neue Karten geladen');
          resolve(mergedStack);
        });
      }, () => {
      });
    });
  }

  /**
   * Initialize uninitialized stack
   * @param stack existing stack
   */
  private initializeUninitializedStack(stack: Stack) {
    StacksService.getUninitializedDefaultStackIDs([stack]).forEach(stackID => {
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
      takeUntil(this.unsubscribeSubject)
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
  // Find
  //

  /**
   * Finds entities by a given ID
   * @param id ID
   */
  private findEntities(id: string) {
    switch (VariantService.getVariant()) {
      case Variant.SCIDDLE: {
        if (id != null) {
          this.stacksPersistenceService.findStackByID(id);
        }
        break;
      }
      case Variant.S4F: {
        this.stacksPersistenceService.findStackByID(id);
        break;
      }
    }
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
            themeClass: this.themeService.theme,
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
            authorScientificSupervision: environment.AUTHOR_SCIENTIFIC_SUPERVISION,
            githubUrl: environment.GITHUB_URL,
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
        switch (VariantService.getVariant()) {
          case Variant.SCIDDLE: {
            this.router.navigate([`/${ROUTE_CARDS}/${this.stack.id}`]).then();
            break;
          }
          case Variant.S4F: {
            this.router.navigate([`/${ROUTE_CARDS}`]).then();
            break;
          }
        }
      });
    });
  }

  /**
   * Handles click on multi-player button
   */
  onMultiPlayerClicked() {
    const multiplayerGameDialogRef = this.dialog.open(MultiplayerGameDialogComponent, {
      disableClose: false,
      data: {
        title: this.gameModeMultiPlayer,
        cardCount: this.cardCount,
        minCardCount: this.minCardCount,
        maxCardCount: this.maxCardCount
      },
      autoFocus: false
    });

    multiplayerGameDialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.gameService.initializeMultiPlayerGame(
          this.stack,
          result.teamCount,
          result.useTimeLimit,
          result.difficultyEasy,
          result.difficultyMedium,
          result.difficultyHard,
          result.cardCount).then((initializedStack) => {

          this.stack = initializedStack;

          this.cardsService.shuffleStack(this.stack).then();
          this.stacksPersistenceService.updateStackWithoutNotification(this.stack).then(() => {
            switch (VariantService.getVariant()) {
              case Variant.SCIDDLE: {
                this.router.navigate([`/${ROUTE_CARDS}/${this.stack.id}`]).then();
                break;
              }
              case Variant.S4F: {
                this.router.navigate([`/${ROUTE_CARDS}`]).then();
                break;
              }
            }
          });
        });
      }
    });
  }

  //
  // Helpers
  //

  /**
   * Navigates back to parent view
   */
  private navigateBack() {
    this.router.navigate([`/${ROUTE_STACKS}`]).then();
  }
}
