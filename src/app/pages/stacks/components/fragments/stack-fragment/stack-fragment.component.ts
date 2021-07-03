import {Component, EventEmitter, Input, isDevMode, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../../../../core/ui/services/snackbar.service';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {StacksService} from '../../../../../core/entity/services/stack/stacks.service';
import {Action} from '../../../../../core/entity/model/action.enum';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {GamesService} from '../../../../../core/entity/services/game/games.service';

/**
 * Displays a stack
 */
@Component({
  selector: 'app-stack-fragment',
  templateUrl: './stack-fragment.component.html',
  styleUrls: ['./stack-fragment.component.scss']
})
export class StackFragmentComponent implements OnInit {

  /** Stack to be displayed */
  @Input() stack: Stack;
  /** Default theme to be used */
  @Input() themeClass = 'blue-theme';

  /** Event emitter indicating click on stack */
  @Output() stackEventEmitter = new EventEmitter<{ action: Action, stack: Stack }>();

  /** Title color */
  titleColor = 'black';
  /** Cards count */
  cardsCount = 0;
  /** Whether there exists an ongoing game with this stack */
  existingGame = false;

  /** Dev mode */
  devMode = false;


  /**
   * Constructor
   * @param stacksService stacks service
   * @param snackbarService snackbar service
   * @param dialog dialog
   */
  constructor(private stacksService: StacksService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
    this.devMode = isDevMode();
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.cardsCount = this.stack.cards.filter(CardsService.isCardPartOfStack).length;
    this.existingGame = GamesService.existsGame(this.stack);
  }

  //
  // Actions
  //

  /**
   * Handles click on stack
   */
  onStackClicked() {
    this.stackEventEmitter.emit({action: Action.GO_INTO, stack: this.stack});
  }
}
