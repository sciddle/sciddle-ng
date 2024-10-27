import {OverlayContainer} from '@angular/cdk/overlay';
import {AfterViewInit, Component, isDevMode, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../environments/environment';
import {LogService} from './core/log/services/log.service';
import {PouchDBSettingsService} from './core/persistence/services/pouchdb-settings.service';
import {PouchDBService} from './core/persistence/services/pouchdb.service';
import {SnackbarService} from './core/ui/services/snackbar.service';
import {ThemeService} from './core/ui/services/theme.service';
import {Variant} from './core/util/model/variant.enum';
import {MaterialIconService} from "./core/ui/services/material-icon.service";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {TranslocoService} from "@ngneat/transloco";

/**
 * Displays application
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  /** Default app theme */
  public themeClass = 'blue-theme';

  /** Dev mode */
  public devMode = false;

  /**
   * Constructor
   * @param iconRegistry icon registry
   * @param materialIconService Material icon service
   * @param overlayContainer overlay container
   * @param pouchDBService pouchDB service
   * @param pouchDBSettingsService pouchDB settings service
   * @param sanitizer sanitizer
   * @param snackbarService snackbar service
   * @param snackBar snack bar
   * @param themeService theme service
   */
  constructor(private iconRegistry: MatIconRegistry,
              private materialIconService: MaterialIconService,
              private overlayContainer: OverlayContainer,
              private pouchDBService: PouchDBService,
              private pouchDBSettingsService: PouchDBSettingsService,
              private sanitizer: DomSanitizer,
              private snackbarService: SnackbarService,
              public snackBar: MatSnackBar,
              private themeService: ThemeService) {
    this.devMode = isDevMode();
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  public ngOnInit() {
    this.initializeTheme();
    this.initializeThemeSubscription();
    this.initializeSnackbar();

    this.initializeMaterial();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  public ngAfterViewInit() {
    this.initializeDatabaseSync();
  }

  //
  // Initialization
  //

  /**
   * Initializes theme
   */
  private initializeTheme() {
    LogService.trace(`AppComponent#initializeTheme`);
    switch (environment.VARIANT) {
      case Variant.SCIDDLE: {
        this.themeClass = 'blue-theme';
        break;
      }
      case Variant.S4F: {
        this.themeClass = 'future-theme';
        break;
      }
    }
  }

  /**
   * Initializes theme subscription
   */
  private initializeThemeSubscription() {
    LogService.trace(`AppComponent#initializeThemeSubscription`);
    this.themeService.themeSubject.subscribe((value) => {
      this.themeClass = value;

      // Theme menus and dialogs
      const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(value);
    });
  }

  //
  // Initialization
  //

  /**
   * Initializes snack bar
   */
  private initializeSnackbar() {
    this.snackbarService.messageSubject.subscribe((snack) => {
        this.openSnackBar(snack[0], snack[1], snack[2]);
      },
    );
  }

  /**
   * Initializes material colors and icons
   */
  private initializeMaterial() {
    this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
  }

  /**
   * Initializes database sync
   */
  private initializeDatabaseSync() {
    if (this.devMode) {
      this.pouchDBService.sync(`http://localhost:5984/${environment.DATABASE_ENTITIES}`);
      this.pouchDBSettingsService.sync(`http://localhost:5984/${environment.DATABASE_SETTINGS}`);
    }
  }

  //
  // Actions
  //

  /**
   * Handles messages that shall be displayed in a snack bar
   * @param message message to be displayed
   * @param actionName action name to be displayed
   * @param action action to be triggered if action name is clicked
   */
  private openSnackBar(message: string, actionName: string, action: any) {
    const snackbarRef = this.snackBar.open(message, actionName, {
      duration: 5000,
    });

    if (action != null) {
      snackbarRef.onAction().subscribe(action);
    }
  }
}
