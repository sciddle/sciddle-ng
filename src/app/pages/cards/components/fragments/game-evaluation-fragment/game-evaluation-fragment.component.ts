import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';

/**
 * Display game evaluation fragment
 */
@Component({
  selector: 'app-game-evaluation-fragment',
  templateUrl: './game-evaluation-fragment.component.html',
  styleUrls: ['./game-evaluation-fragment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameEvaluationFragmentComponent {

  /** Stack */
  @Input() public stack: Stack;
  /** Array of winning teams */
  @Input() public winningTeams = [];
  /** Event emitter indicating menu items being clicked */
  @Output() public menuItemEventEmitter = new EventEmitter<string>();

  //
  // Actions
  //

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  public onMenuItemClicked(menuItem: string) {
    this.menuItemEventEmitter.emit(menuItem);
  }
}
