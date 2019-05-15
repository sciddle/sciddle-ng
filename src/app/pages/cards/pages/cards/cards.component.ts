import {Component, OnDestroy, OnInit} from '@angular/core';
import {Media} from '../../../../core/ui/model/media.enum';
import {environment} from '../../../../../environments/environment';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {

  /** App title */
  public title = environment.APP_NAME;

  /** Title color */
  public titleColor = 'black';
  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param dialog dialog
   * @param iconRegistry iconRegistry
   * @param mediaService media service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param sanitizer sanitizer
   */
  constructor(public dialog: MatDialog,
              private iconRegistry: MatIconRegistry,
              private mediaService: MediaService,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private sanitizer: DomSanitizer) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeColors();
    this.initializeMaterial();
    this.initializeMediaSubscription();
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

  // Others

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

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
  }
}
