import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SnackbarService} from './core/ui/services/snackbar.service';
import {MatSnackBar} from '@angular/material';
import {PouchDBService} from './core/persistence/services/pouchdb.service';
import {environment} from '../environments/environment';
import {ThemeService} from './core/ui/services/theme.service';
import {OverlayContainer} from '@angular/cdk/overlay';

/**
 * Displays application
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  /** Default app theme */
  themeClass = 'blue-theme';

  /**
   * Constructor
   * @param overlayContainer overlay container
   * @param pouchDBService pouchDB service
   * @param snackbarService snackbar service
   * @param snackBar snack bar
   * @param themeService theme service
   */
  constructor(private overlayContainer: OverlayContainer,
              private pouchDBService: PouchDBService,
              private snackbarService: SnackbarService,
              public snackBar: MatSnackBar,
              private themeService: ThemeService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTheme();
    this.initializeThemeSubscription();
    this.initializeSnackbar();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit() {
    this.initializeDatabaseSync();
  }

  //
  // Initialization
  //

  /**
   * Initializes theme
   */
  private initializeTheme() {
    this.themeClass = this.themeService.theme;
    this.overlayContainer.getContainerElement().classList.add(this.themeService.theme);
  }

  /**
   * Initializes theme subscription
   */
  private initializeThemeSubscription() {
    this.themeService.themeSubject.subscribe(value => {
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
    this.snackbarService.messageSubject.subscribe(snack => {
        this.openSnackBar(snack[0], snack[1], snack[2]);
      }
    );
  }

  /**
   * Initializes database sync
   */
  private initializeDatabaseSync() {
    this.pouchDBService.sync(`http://localhost:5984/${environment.DATABASE_ENTITIES}`);
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
