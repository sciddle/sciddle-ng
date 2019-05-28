import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Media} from '../../../../../core/ui/model/media.enum';
import {GameMode} from '../../../../../core/entity/model/game-mode.enum';

/**
 * Displays cards toolbar
 */
@Component({
  selector: 'app-cards-toolbar',
  templateUrl: './cards-toolbar.component.html',
  styleUrls: ['./cards-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsToolbarComponent {

  /** Title displayed in the toolbar */
  @Input() title;
  /** Title color */
  @Input() titleColor = 'black';
  /** Current media */
  @Input() media: Media;
  /** Game mode */
  @Input() gameMode: GameMode;
  /** Card count */
  @Input() cardCount: number;
  /** Event emitter indicating menu items being clicked */
  @Output() menuItemEventEmitter = new EventEmitter<string>();

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
}
