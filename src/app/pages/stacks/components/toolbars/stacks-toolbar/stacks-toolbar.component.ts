import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Media} from '../../../../../core/ui/model/media.enum';

/**
 * Displays stacks toolbar
 */
@Component({
  selector: 'app-stacks-toolbar',
  templateUrl: './stacks-toolbar.component.html',
  styleUrls: ['./stacks-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacksToolbarComponent {

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
