import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  isDevMode,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {WikipediaService} from '../../../../../core/wikipedia/services/wikipedia.service';
import {MatDialog} from '@angular/material';
import {WikipediaDialogComponent} from '../../dialogs/wikpedia-dialog/wikipedia-dialog.component';
import {Theme} from '../../../../../core/ui/model/theme.enum';

/**
 * Displays a card
 */
@Component({
  selector: 'app-card-fragment',
  templateUrl: './card-fragment.component.html',
  styleUrls: ['./card-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CardFragmentComponent implements OnChanges {

  /** Stack the card is contained in */
  @Input() stack = new Stack();
  /** Card to be displayed */
  @Input() card = new Card();
  /** Indicator that timer is over */
  @Input() isTimerOver = false;
  /** Current media */
  @Input() media: Media;
  /** Current theme */
  @Input() theme: Theme = Theme.BLUE;

  /** Enum for media types */
  mediaType = Media;

  /** Dev mode */
  devMode = false;

  /** Difficulty display long text */
  difficultyDisplayLongText = false;
  /** Difficulty class */
  difficultyClass = '';
  /** Difficulty text */
  difficultyText = '';
  /** Difficulty long text */
  difficultyLongText = '';
  /** Difficulty combined text */
  difficultyCombinedText = '';
  /** CSS class applied to card */
  public cardClassName;

  /**
   * Constructor
   * @param dialog dialog
   * @param materialColorService material color service
   * @param wikipediaService wikipedia service
   */
  constructor(public dialog: MatDialog,
              private materialColorService: MaterialColorService,
              private wikipediaService: WikipediaService) {
    this.devMode = isDevMode();
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initializeDifficultyDisplaySettings();
    this.initializeCssClass();
  }

  //
  // Initialization
  //

  /**
   * Initializes difficulty display settings
   */
  private initializeDifficultyDisplaySettings() {
    this.difficultyDisplayLongText = false;

    switch (this.card.difficulty) {
      case 1: {
        this.difficultyClass = 'difficultyColorEasy';
        this.difficultyText = '1';
        this.difficultyLongText = 'EINFACH';
        this.difficultyCombinedText = `${this.difficultyLongText} / ${this.difficultyText} Punkt`;
        break;
      }
      case 2: {
        this.difficultyClass = 'difficultyColorMedium';
        this.difficultyText = '2';
        this.difficultyLongText = 'MITTEL';
        this.difficultyCombinedText = `${this.difficultyLongText} / ${this.difficultyText} Punkte`;
        break;
      }
      case 3: {
        this.difficultyClass = 'difficultyColorHard';
        this.difficultyText = '3';
        this.difficultyLongText = 'SCHWER';
        this.difficultyCombinedText = `${this.difficultyLongText} / ${this.difficultyText} Punkte`;
        break;
      }
    }
  }

  /**
   * Initialize CSS class
   */
  private initializeCssClass() {
    this.cardClassName = (this.isTimerOver) ? 'grayscale' : null;
  }

  //
  // Actions
  //

  /**
   * Handles click on help button
   */
  onHelpClicked() {
    this.dialog.open(WikipediaDialogComponent, {
      disableClose: false,
      data: {
        themeClass: this.theme,
        term: this.getTerm(this.card),
        explanationText: this.card.alternateExplanationText,
        alternateWikipediaArticle: this.card.alternateWikipediaArticle,
        alternateURL: this.card.alternateURL,
        action: 'Verstanden',
      },
      autoFocus: false
    });
  }

  /**
   * Handles click on difficulty indicator
   */
  onDifficultyClicked() {
    this.difficultyDisplayLongText = !this.difficultyDisplayLongText;
  }

  //
  // Helpers
  //

  /**
   * Determines term to display in explanation dialog
   * @param card card
   */
  private getTerm(card: Card) {
    return this.card.alternateWikipediaArticle != null && this.card.alternateWikipediaArticle !== ''
      ? this.card.alternateWikipediaArticle : this.card.word;
  }
}
