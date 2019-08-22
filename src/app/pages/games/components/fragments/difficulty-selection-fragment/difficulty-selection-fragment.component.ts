import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

/**
 * Displays difficulty selection fragment
 */
@Component({
  selector: 'app-difficulty-selection-fragment',
  templateUrl: './difficulty-selection-fragment.component.html',
  styleUrls: ['./difficulty-selection-fragment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DifficultySelectionFragmentComponent {

  /** Selected difficulty easy */
  @Input() difficultyEasy;
  /** Selected difficulty medium */
  @Input() difficultyMedium;
  /** Selected difficulty hard */
  @Input() difficultyHard;
  /** Event emitter indicating changes in difficulty selection */
  @Output() difficultySelectionChangedEmitter = new EventEmitter<{ difficulty: number, selected: boolean }>();

  //
  // Actions
  //

  /**
   * Toggles usage difficulty
   * @param toggledDifficulty toggled difficulty
   */
  onDifficultToggled(toggledDifficulty: number) {
    switch (toggledDifficulty) {
      case 1: {
        this.difficultyEasy = !this.difficultyEasy;
        this.difficultySelectionChangedEmitter.emit({difficulty: toggledDifficulty, selected: this.difficultyEasy});
        break;
      }
      case 2: {
        this.difficultyMedium = !this.difficultyMedium;
        this.difficultySelectionChangedEmitter.emit({difficulty: toggledDifficulty, selected: this.difficultyMedium});
        break;
      }
      case 3: {
        this.difficultyHard = !this.difficultyHard;
        this.difficultySelectionChangedEmitter.emit({difficulty: toggledDifficulty, selected: this.difficultyHard});
        break;
      }
    }
  }
}
