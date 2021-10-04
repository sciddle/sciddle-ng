import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  isDevMode,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {GameMode} from '../../../../../core/entity/model/game-mode.enum';
import {LogService} from '../../../../../core/log/services/log.service';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Variant} from '../../../../../core/util/model/variant.enum';
import {VariantService} from '../../../../../core/util/services/variant.service';

/**
 * Displays stacks toolbar
 */
@Component({
  selector: 'app-cards-toolbar',
  templateUrl: './cards-toolbar.component.html',
  styleUrls: ['./cards-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardsToolbarComponent implements OnChanges {

  /** Title displayed in the toolbar */
  @Input() public title;
  /** Current media */
  @Input() public media: Media;
  /** Game mode */
  @Input() public gameMode: GameMode;
  /** Selected time limit mode */
  @Input() public useTimeLimit = false;
  /** Timer start time */
  @Input() public timerStartTime;
  /** Timer duration */
  @Input() public timerDuration;
  /** Indicator that timer is over */
  @Input() public timerOver = false;
  /** Card count */
  @Input() public cardCount: number;
  /** Event emitter indicating menu items being clicked */
  @Output() public menuItemEventEmitter = new EventEmitter<string>();
  /** Event emitter indicating timer to be over */
  @Output() public timerOverEmitter = new EventEmitter<any>();

  /** Timer color */
  public timerColor = 'primary';

  /** Enum for media types */
  public mediaType = Media;
  /** Enum of game mode types */
  public gameModeType = GameMode;
  /** Enum of variants */
  public variantType = Variant;

  /** Dev mode */
  public devMode = false;

  /** App variant */
  public variant = VariantService.getVariant();

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
  public ngOnChanges(changes: SimpleChanges) {
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
  public onMenuItemClicked(menuItem: string): void {
    this.menuItemEventEmitter.emit(menuItem);
  }

  /**
   * Handles time-left event
   * @param timeLeft time left in seconds
   */
  public onTimeLeft(timeLeft: number) {
    if (timeLeft <= 0) {
      LogService.debug(`time left <= 0`);
      this.timerOverEmitter.emit();
    }
  }
}
