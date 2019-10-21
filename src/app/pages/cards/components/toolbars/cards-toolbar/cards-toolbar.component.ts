import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  isDevMode, OnChanges, OnInit,
  Output, SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {Media} from '../../../../../core/ui/model/media.enum';
import {GameMode} from '../../../../../core/entity/model/game-mode.enum';
import {environment} from '../../../../../../environments/environment';
import {Variant} from '../../../../../core/util/model/variant.enum';
import {VariantService} from '../../../../../core/util/services/variant.service';
import {LogService} from '../../../../../core/log/services/log.service';

/**
 * Displays stacks toolbar
 */
@Component({
  selector: 'app-cards-toolbar',
  templateUrl: './cards-toolbar.component.html',
  styleUrls: ['./cards-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CardsToolbarComponent implements OnChanges {

  /** Title displayed in the toolbar */
  @Input() title;
  /** Current media */
  @Input() media: Media;
  /** Game mode */
  @Input() gameMode: GameMode;
  /** Selected time limit mode */
  @Input() useTimeLimit = false;
  /** Timer start time */
  @Input() timerStartTime;
  /** Timer duration */
  @Input() timerDuration;
  /** Indicator that timer is over */
  @Input() timerOver = false;
  /** Card count */
  @Input() cardCount: number;
  /** Event emitter indicating menu items being clicked */
  @Output() menuItemEventEmitter = new EventEmitter<string>();
  /** Event emitter indicating timer to be over */
  @Output() timerOverEmitter = new EventEmitter<any>();

  /** Timer color */
  timerColor = 'primary';

  /** Enum for media types */
  mediaType = Media;
  /** Enum of game mode types */
  gameModeType = GameMode;
  /** Enum of variants */
  variantType = Variant;

  /** Dev mode */
  devMode = false;

  /** App variant */
  variant = VariantService.getVariant();

  /**
   * Constructor
   */
  constructor() {
    this.devMode = isDevMode();
  }

  /**
   * Handles on-change lifecycle phase
   * @param changes simple changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeTimerColor();
  }

  //
  // Initialization
  //

  /**
   * Initializes timer color
   */
  private initializeTimerColor() {
    this.timerColor = (this.timerOver) ? 'warn' : 'primary';
  }

  //
  // Actions
  //

  /** Handles click on menu item
   * @param menuItem menu item
   */
  onMenuItemClicked(menuItem: string): void {
    this.menuItemEventEmitter.emit(menuItem);
  }

  /**
   * Handles time-left event
   * @param timeLeft time left in seconds
   */
  onTimeLeft(timeLeft: number) {
    if (timeLeft <= 0) {
      LogService.debug(`time left <= 0`);
      this.timerOverEmitter.emit();
    }
  }
}
