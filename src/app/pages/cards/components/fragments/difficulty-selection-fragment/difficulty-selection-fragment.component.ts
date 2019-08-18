import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';

/**
 * Displays difficulty selection fragment
 */
@Component({
  selector: 'app-difficulty-selection-fragment',
  templateUrl: './difficulty-selection-fragment.component.html',
  styleUrls: ['./difficulty-selection-fragment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DifficultySelectionFragmentComponent implements OnInit {

  /** Stack */
  @Input() stack: Stack;
  /** Event emitter indicating difficulty selection */
  @Output() difficultySelectedEmitter = new EventEmitter<number>();

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
  ngOnInit() {
    this.initializeCards();
  }

  //
  // Initialization
  //

  /**
   * Initializes cards
   */
  initializeCards() {
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
  onDifficultySelected(difficulty: number) {
    this.difficultySelectedEmitter.emit(difficulty);
  }
}
