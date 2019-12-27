import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Variant} from '../../../../../core/util/model/variant.enum';
import {VariantService} from '../../../../../core/util/services/variant.service';

/**
 * Displays games toolbar
 */
@Component({
  selector: 'app-games-toolbar',
  templateUrl: './games-toolbar.component.html',
  styleUrls: ['./games-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GamesToolbarComponent {

  /** Title displayed in the toolbar */
  @Input() title;
  /** Current media */
  @Input() media: Media;
  /** Event emitter indicating menu items being clicked */
  @Output() menuItemEventEmitter = new EventEmitter<string>();

  /** Enum for media types */
  mediaType = Media;
  /** Enum of variants */
  variantType = Variant;

  /** App variant */
  variant = VariantService.getVariant();

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
