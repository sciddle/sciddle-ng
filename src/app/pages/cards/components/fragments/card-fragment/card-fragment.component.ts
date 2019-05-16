import {ChangeDetectionStrategy, Component, Input, isDevMode, OnInit} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {Media} from '../../../../../core/ui/model/media.enum';

/**
 * Displays a card
 */
@Component({
  selector: 'app-card-fragment',
  templateUrl: './card-fragment.component.html',
  styleUrls: ['./card-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFragmentComponent implements OnInit {

  /** Stack the card is contained in */
  @Input() stack = new Stack();
  /** Card to be displayed */
  @Input() card;
  /** Current media */
  @Input() media: Media;
  /** Default theme to be used */
  @Input() themeClass = 'light-theme';

  /** Color of difficulty inidicator */
  difficultyColor = '#fff';

  /** Enum for media types */
  mediaType = Media;

  /** Dev mode */
  devMode = false;


  /**
   * Constructor
   */
  constructor() {
    this.devMode = isDevMode();
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeColors();
  }

  //
  // Initialization
  //

  // Others

  /**
   * Initializes colors
   */
  private initializeColors() {
    switch (this.card.difficulty) {
      case 1: {
        this.difficultyColor = '#4caf50';
        break;
      }
      case 2: {
        this.difficultyColor = '#ffca28';
        break;
      }
      case 3: {
        this.difficultyColor = '#f44336';
        break;
      }
    }
  }
}
