import {AfterViewInit, Component, Inject, isDevMode, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {Media} from '../../../../core/ui/model/media.enum';
import {takeUntil} from 'rxjs/operators';
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

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** JSON class for debugging */
  public json = JSON;
  /** Dev mode */
  devMode = false;

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

    this.initializeTheme();
    this.initializeMaterial();
    this.initializeMediaSubscription();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit() {
    this.findEntities();
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
      }

      this.initializeUninitializedStacks(stacks);
    });
  }

  /**
   * Initializes stacks
   * @param stacks stack
   */
  private initializeStacks(stacks: Stack[]) {
    this.stacks = stacks;
    this.stacks.forEach(stack => {
      this.stacksService.mergeStackFromAssets(stack).then(resolve => {
        const mergedStack = resolve as Stack;
        this.stacksPersistenceService.updateStack(mergedStack).then(() => {
        });
        this.snackbarService.showSnackbar('Neue Karten geladen');
      }, () => {
      });
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
   * Finds entities
   */
  private findEntities() {
    this.stacksPersistenceService.findStacks();
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
        this.router.navigate([`/games/${stack.id}`]).then();
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
            name: environment.APP_NAME,
            version: environment.VERSION,
            authorCode: environment.AUTHOR_CODE,
            authorContent: environment.AUTHOR_CONTENT,
            authorScientificSupervision: environment.AUTHOR_SCIENTIFIC_SUPERVISION,
            licenseCode: environment.LICENSE_CODE,
            licenseContent: environment.LICENSE_CONTENT,
            homepage: environment.HOMEPAGE,
          }
        });
        break;
      }
    }
  }
}
