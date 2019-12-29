import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {environment} from '../../../../../../environments/environment';
import {Language} from '../../../../../core/language/model/language.enum';

/**
 * Displays team information fragment
 */
@Component({
  selector: 'app-team-information-fragment',
  templateUrl: './team-information-fragment.component.html',
  styleUrls: ['./team-information-fragment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TeamInformationFragmentComponent {

  /** Stack */
  @Input() stack: Stack;
  /** Event emitter indicating click */
  @Output() teamInformationClickedEmitter = new EventEmitter<any>();

  /** App language */
  language = environment.LANGUAGE;

  /** Enum of languages */
  public languageType = Language;

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
