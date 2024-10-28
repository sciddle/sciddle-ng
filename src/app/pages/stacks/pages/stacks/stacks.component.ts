import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, Inject, isDevMode, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import {ROUTE_GAMES} from '../../../../app.routes';
import {STACK_PERSISTENCE_POUCHDB} from '../../../../core/entity/entity.module';
import {Action} from '../../../../core/entity/model/action.enum';
import {Stack} from '../../../../core/entity/model/stack/stack.model';
import {CloneService} from '../../../../core/entity/services/clone.service';
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
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
// tslint:disable-next-line:max-line-length
import {ManualDialogComponent} from "../../../../ui/manual-dialog/manual-dialog/manual-dialog.component";
import {
  OpenSourceDialogComponent
} from "../../../../ui/open-source-dialog/open-source-dialog/open-source-dialog.component";

/**
 * Displays stacks
 */
@Component({
  selector: 'app-stacks',
  templateUrl: './stacks.component.html',
  styleUrls: ['./stacks.component.scss'],
})
export class StacksComponent implements OnInit, AfterViewInit, OnDestroy {

  /** App title */
  public title = environment.APP_NAME;

  /** Array of stacks */
  public stacks: Stack[] = [];

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
  /** Dev mode */
  public devMode = false;

  /** App variant */
  public variant = environment.VARIANT;

  /**
   * Constructor
   * @param dialog dialog
   * @param http http client
   * @param iconRegistry icon registry
   * @param mediaService media service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param router router
   * @param sanitizer sanitizer
   * @param settingsService settings service
   * @param snackbarService snackbar service
   * @param stacksService stacks service
   * @param stacksPersistenceService stack persistence service
   * @param themeService theme service
   */
  constructor(public dialog: MatDialog,
              private http: HttpClient,
              private iconRegistry: MatIconRegistry,
              private mediaService: MediaService,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private settingsService: SettingsService,
              private snackbarService: SnackbarService,
              private stacksService: StacksService,
              @Inject(STACK_PERSISTENCE_POUCHDB) private stacksPersistenceService: StacksPersistenceService,
              private themeService: ThemeService) {
    this.devMode = isDevMode();
  }

  /**
   * Handles on-init lifecycle phase
   */
  public ngOnInit() {
    this.initializeStacksSubscription();
    this.initializeSettingsSubscription();
    this.initializeDatabaseErrorSubscription();

    this.initializeTheme();
    this.initializeMaterial();
    this.initializeMediaSubscription();
    this.initializeThemeSubscription();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  public ngAfterViewInit() {
    this.findEntities();
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
   * Initializes stacks subscription
   */
  private initializeStacksSubscription() {
    this.stacksPersistenceService.stacksSubject.pipe(
      takeUntil(this.unsubscribeSubject),
    ).subscribe((value) => {
      let stacks = [];

      if (value != null) {
        stacks = value as Stack[];
        this.initializeStacks(stacks);
        this.mergeStacksFromAssets();
      }

      this.initializeUninitializedStacks(stacks);
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
   * Initializes database error subscription
   */
  private initializeDatabaseErrorSubscription() {
    LogService.trace(`StacksComponent#initializeDatabaseErrorSubscription`);
    this.stacksPersistenceService.databaseErrorSubject.pipe(
      takeUntil(this.unsubscribeSubject),
    ).subscribe((value) => {
      LogService.warn(`${JSON.stringify(value)}`);
      // TODO Check error more specifically
      if (value != null) {
        this.stacks = [];

        Array.from(StacksService.stacks.values()).forEach((fileName) =>
          this.stacksService.getStackFromAssets(fileName).then((stackFromAssets) => {
            LogService.trace(`StacksComponent > STACK FROM ASSETS`);
            if (stackFromAssets != null) {
              this.initializeStacks(this.stacks.concat([stackFromAssets]));
              this.snackbarService.showSnackbar('Achtung: Spiel wird nicht gespeichert.');
            }
          }),
        );
      }
    });
  }

  /**
   * Initializes stacks
   * @param stacks stack
   */
  private initializeStacks(stacks: Stack[]) {
    this.stacks = stacks.sort(StacksService.sortStacks);
  }

  /**
   * Initializes stacks
   */
  private mergeStacksFromAssets() {
    LogService.trace(`StacksComponent#mergeStacksFromAssets`);

    this.stacks.forEach((stack) => {
      // Merge cards from assets for stacks without ongoing game
      if (!GamesService.existsGame(stack)) {
        this.stacksService.mergeStackFromAssets(stack).then((resolve) => {
          const mergedStack = resolve as Stack;
          this.stacksPersistenceService.updateStack(mergedStack).then(() => {
          });
          this.snackbarService.showSnackbar('Neue Karten geladen');
        }, () => {
        });
      }
    });
  }

  /**
   * Initialize uninitialized stacks
   * @param stacks existing stacks
   */
  private initializeUninitializedStacks(stacks: Stack[]) {
    StacksService.getUninitializedStackIDs(stacks).forEach((stackID) => {
      const stack = new Stack();
      stack.id = stackID;
      this.stacksPersistenceService.createStack(stack).then();
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
   * Initializes theme
   */
  private initializeTheme() {
    this.themeService.switchTheme(Theme.BLUE);
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
   * Finds entities
   */
  private findEntities() {
    this.stacksPersistenceService.findStacks();
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
   * Handles events targeting a stack
   * @param event event parameters
   */
  public onStackEvent(event: { action: Action, stack: Stack }) {
    const stack = CloneService.cloneStack(event.stack as Stack);

    switch (event.action) {
      case Action.GO_INTO: {
        this.navigate(`/${ROUTE_GAMES}/${stack.id}`);
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  public onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
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
   * Navigates to a given path
   *
   * @param path path to navigate to
   */
  private navigate(path: string) {
    LogService.trace(`StacksComponent#navigate ${path}`);
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
    this.router.navigate([path]).then();
  }
}
