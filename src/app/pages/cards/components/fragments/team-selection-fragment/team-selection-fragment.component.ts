import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';

/**
 * Displays team selection fragment
 */
@Component({
  selector: 'app-team-selection-fragment',
  templateUrl: './team-selection-fragment.component.html',
  styleUrls: ['./team-selection-fragment.component.scss']
})
export class TeamSelectionFragmentComponent {

  /** Stack */
  @Input() stack: Stack;
  /** Event emitter indicating team selection */
  @Output() teamSelectedEmitter = new EventEmitter<number>();

  //
  // Actions
  //

  /**
   * Handles selection of successful team
   * @param teamID team ID
   */
  onSuccessfulTeamSelected(teamID: number) {
    this.teamSelectedEmitter.emit(teamID);
  }

}
