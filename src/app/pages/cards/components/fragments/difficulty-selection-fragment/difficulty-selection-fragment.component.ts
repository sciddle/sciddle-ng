import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';

/**
 * Displays difficulty selection fragment
 */
@Component({
  selector: 'app-difficulty-selection-fragment',
  templateUrl: './difficulty-selection-fragment.component.html',
  styleUrls: ['./difficulty-selection-fragment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DifficultySelectionFragmentComponent implements OnInit {

  /** Stack */
  @Input() public stack: Stack;
  /** Event emitter indicating difficulty selection */
  @Output() public difficultySelectedEmitter = new EventEmitter<number>();

  /** Array of easy cards */
  public cardsEasy: Card[] = [];
  /** Array of medium cards */
  public cardsMedium: Card[] = [];
  /** Array of hard cards */
  public cardsHard: Card[] = [];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  public ngOnInit() {
    this.initializeCards();
  }

  //
  // Initialization
  //

  /**
   * Initializes cards
   */
  public initializeCards() {
    if (this.stack != null) {
      this.cardsEasy = this.stack.cards.filter(CardsService.isEasy);
      this.cardsMedium = this.stack.cards.filter(CardsService.isMedium);
      this.cardsHard = this.stack.cards.filter(CardsService.isHard);
    }
  }

  //
  // Actions
  //

  /**
   * Handles difficulty selection
   * @param difficulty difficulty
   */
  public onDifficultySelected(difficulty: number) {
    this.difficultySelectedEmitter.emit(difficulty);
  }
}
