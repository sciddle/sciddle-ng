import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

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
  /** Event emitter indicating menu items being clicked */
  @Output() menuItemEventEmitter = new EventEmitter<string>();

  /** Enum for media types */
  mediaType = Media;

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
