import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';

/**
 * Displays team information fragment
 */
@Component({
  selector: 'app-team-information-fragment',
  templateUrl: './team-information-fragment.component.html',
  styleUrls: ['./team-information-fragment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TeamInformationFragmentComponent {

  /** Stack */
  @Input() public stack: Stack;
  /** Event emitter indicating click */
  @Output() public teamInformationClickedEmitter = new EventEmitter<any>();

  //
  // Actions
  //

  /**
   * Handles click on displayed team
   */
  public onDisplayTeamClicked() {
    this.teamInformationClickedEmitter.emit();
  }
}
