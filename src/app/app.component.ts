import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SnackbarService} from './core/ui/services/snackbar.service';
import {MatSnackBar} from '@angular/material';
import {PouchDBService} from './core/persistence/services/pouchdb.service';
import {environment} from '../environments/environment';

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
  themeClass = 'light-theme';

  /**
   * Constructor
   * @param pouchDBService pouchDB service
   * @param snackbarService snackbar service
   * @param snackBar snack bar
   */
  constructor(private pouchDBService: PouchDBService,
              private snackbarService: SnackbarService,
              public snackBar: MatSnackBar) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
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
