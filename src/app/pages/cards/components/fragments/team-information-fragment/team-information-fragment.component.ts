import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';

/**
 * Displays team information fragment
 */
@Component({
  selector: 'app-team-information-fragment',
  templateUrl: './team-information-fragment.component.html',
  styleUrls: ['./team-information-fragment.component.scss']
})
export class TeamInformationFragmentComponent {

  /** Stack */
  @Input() stack: Stack;
  /** Event emitter indicating click */
  @Output() teamInformationClickedEmitter = new EventEmitter<any>();

  //
  // Actions
  //

  /**
   * Handles click on displayed team
   */
  onDisplayTeamClicked() {
    this.teamInformationClickedEmitter.emit();
  }
}
