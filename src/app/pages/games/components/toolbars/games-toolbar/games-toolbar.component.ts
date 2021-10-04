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
  encapsulation: ViewEncapsulation.None,
})
export class GamesToolbarComponent {

  /** Title displayed in the toolbar */
  @Input() public title;
  /** Current media */
  @Input() public media: Media;
  /** Event emitter indicating menu items being clicked */
  @Output() public menuItemEventEmitter = new EventEmitter<string>();

  /** Enum for media types */
  public mediaType = Media;
  /** Enum of variants */
  public variantType = Variant;

  /** App variant */
  public variant = VariantService.getVariant();

  //
  // Actions
  //

  /** Handles click on menu item
   * @param menuItem menu item
   */
  public onMenuItemClicked(menuItem: string): void {
    this.menuItemEventEmitter.emit(menuItem);
  }
}
