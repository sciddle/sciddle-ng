import {AfterViewInit, Component, Inject, isDevMode, OnDestroy, OnInit} from '@angular/core';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {Media} from '../../../../core/ui/model/media.enum';
import {filter, takeUntil} from 'rxjs/operators';
import {Stack} from '../../../../core/entity/model/stack/stack.model';
import {Subject} from 'rxjs';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {STACK_PERSISTENCE_POUCHDB} from '../../../../core/entity/entity.module';
import {StacksPersistenceService} from '../../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {Action} from '../../../../core/entity/model/action.enum';
import {CloneService} from '../../../../core/entity/services/clone.service';
import {StacksService} from '../../../../core/entity/services/stack/stacks.service';
import {ThemeService} from '../../../../core/ui/services/theme.service';
import {Theme} from '../../../../core/ui/model/theme.enum';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {Setting} from '../../../../core/settings/model/setting.model';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
// tslint:disable-next-line:max-line-length
import {CheckableInformationDialogComponent} from '../../../../ui/information-dialog/checkable-information-dialog/checkable-information-dialog.component';
import {ROUTE_GAMES} from '../../../../app.routes';
import {GamesService} from '../../../../core/entity/services/game/games.service';
import {LogService} from '../../../../core/log/services/log.service';
import {Language} from '../../../../core/language/model/language.enum';
import {MatDialog} from '@angular/material/dialog';
import {MatIconRegistry} from '@angular/material/icon';

/**
 * Displays stacks
 */
@Component({
  selector: 'app-stacks',
  templateUrl: './stacks.component.html',
  styleUrls: ['./stacks.component.scss']
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
  devMode = false;

  /** App variant */
  variant = environment.VARIANT;
  /** App language */
  language = environment.LANGUAGE;

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
  ngOnInit() {
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
  ngAfterViewInit() {
    this.findEntities();
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
   * Initializes stacks subscription
   */
  private initializeStacksSubscription() {
    this.stacksPersistenceService.stacksSubject.pipe(
      takeUntil(this.unsubscribeSubject)
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
    LogService.trace(`StacksComponent#initializeDatabaseErrorSubscription`);
    this.stacksPersistenceService.databaseErrorSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      LogService.warn(`${JSON.stringify(value)}`);
      // TODO Check error more specifically
      if (value != null) {
        this.stacks = [];

        switch (this.language) {
          case Language.GERMAN: {
            Array.from(StacksService.stacksDe.values()).forEach(fileName =>
              this.stacksService.getStackFromAssets(fileName).then(stackFromAssets => {
                LogService.trace(`StacksComponent > STACK FROM ASSETS`);
                if (stackFromAssets != null) {
                  this.initializeStacks(this.stacks.concat([stackFromAssets]));
                  this.snackbarService.showSnackbar('Achtung: Spiel wird nicht gespeichert.');

                }
              })
            );
            break;
          }
          case Language.ENGLISH: {
            console.log(`++ FOO B`);
            Array.from(StacksService.stacksEn.values()).forEach(fileName =>
              this.stacksService.getStackFromAssets(fileName).then(stackFromAssets => {
                LogService.trace(`StacksComponent > STACK FROM ASSETS`);
                if (stackFromAssets != null) {
                  this.initializeStacks(this.stacks.concat([stackFromAssets]));
                  this.snackbarService.showSnackbar('Warning: Game will not be saved.');
                }
              })
            );
            break;
          }
        }
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

    this.stacks.forEach(stack => {
      // Merge cards from assets for stacks without ongoing game
      if (!GamesService.existsGame(stack)) {
        this.stacksService.mergeStackFromAssets(stack).then(resolve => {
          const mergedStack = resolve as Stack;
          this.stacksPersistenceService.updateStack(mergedStack).then(() => {
          });
          switch (this.language) {
            case Language.GERMAN: {
              this.snackbarService.showSnackbar('Neue Karten geladen');
              break;
            }
            case Language.ENGLISH: {
              this.snackbarService.showSnackbar('Loaded new cards');
              break;
            }
          }
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
    StacksService.getUninitializedStackIDs(stacks).forEach(stackID => {
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
  onStackEvent(event: { action: Action, stack: Stack }) {
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
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'manual': {
        let file;
        switch (environment.LANGUAGE) {
          case Language.GERMAN: {
            file = 'assets/manual/manual-de.md';
            break;
          }
          case Language.ENGLISH: {
            file = 'assets/manual/manual-en.md';
            break;
          }
        }

        if (file != null) {
          this.http.get(file).subscribe(
            () => {
            }, err => {
              let title = '';
              let checkboxText = '';
              let action = '';
              switch (this.language) {
                case Language.GERMAN: {
                  title = 'Anleitung';
                  checkboxText = 'Anleitung beim Starten nicht mehr anzeigen';
                  action = 'Alles klar';
                  break;
                }
                case Language.ENGLISH: {
                  title = 'Manual';
                  checkboxText = 'Do not show on start';
                  action = 'Got it';
                  break;
                }
              }

              const dialogRef = this.dialog.open(CheckableInformationDialogComponent, {
                disableClose: false,
                data: {
                  title,
                  text: JSON.stringify(err.error.text)
                    .replace(/"/g, '')
                    .replace(/\\n/g, '\n')
                    .replace(/\\r/g, '\r'),
                  checkboxValue: this.dontShowManualOnStartup,
                  checkboxText,
                  action
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
        }
        break;
      }
      case 'open-source': {
        this.http.get('assets/open-source/open-source.md').subscribe(
          () => {
          }, err => {
            let title = '';
            let action = '';
            switch (this.language) {
              case Language.GERMAN: {
                title = 'Open Source Komponenten';
                action = 'Alles klar';
                break;
              }
              case Language.ENGLISH: {
                title = 'Open source components';
                action = 'Got it';
                break;
              }
            }

            this.dialog.open(InformationDialogComponent, {
              disableClose: false,
              data: {
                title,
                text: Object.keys(environment.DEPENDENCIES).map(key => {
                  return `${key} ${environment.DEPENDENCIES[key]}`;
                }).concat('---').concat(Object.keys(environment.DEV_DEPENDENCIES).map(key => {
                  return `${key} ${environment.DEV_DEPENDENCIES[key]}`;
                })).join('<br/>'),
                action,
                value: null
              }
            });
          });
        break;
      }

      case 'about': {
        let title = '';
        switch (this.language) {
          case Language.GERMAN: {
            title = 'Über die App';
            break;
          }
          case Language.ENGLISH: {
            title = 'About the app';
            break;
          }
        }

        this.dialog.open(AboutDialogComponent, {
          disableClose: false,
          data: {
            themeClass: this.theme,
            title,
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
