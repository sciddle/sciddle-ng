import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Media} from '../../../../../core/ui/model/media.enum';
import {GameMode} from '../../../../../core/entity/model/game-mode.enum';
import {environment} from '../../../../../../environments/environment';

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
export class CardsToolbarComponent {

  /** Title displayed in the toolbar */
  @Input() title;
  /** Current media */
  @Input() media: Media;
  /** Game mode */
  @Input() gameMode: GameMode;
  /** Selected time limit mode */
  @Input() useTimeLimit = false;
  /** Timer start time */
  @Input() startTime;
  /** Card count */
  @Input() cardCount: number;
  /** Event emitter indicating menu items being clicked */
  @Output() menuItemEventEmitter = new EventEmitter<string>();
  /** Event emitter indicating timer to be over */
  @Output() timerOverEmitter = new EventEmitter<any>();

  /** Timer duration in seconds */
  timerDuration = environment.TIMER / 60;

  /** Enum for media types */
  mediaType = Media;
  /** Enum of game mode types */
  gameModeType = GameMode;

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
      this.timerOverEmitter.emit();
    }
  }
}
