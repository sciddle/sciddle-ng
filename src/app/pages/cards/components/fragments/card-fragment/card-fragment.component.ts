import {
  ChangeDetectionStrategy,
  Component,
  Input,
  isDevMode,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../../../../environments/environment';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {Language} from '../../../../../core/language/model/language.enum';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Theme} from '../../../../../core/ui/model/theme.enum';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {WikipediaService} from '../../../../../core/wikipedia/services/wikipedia.service';
import {WikipediaDialogComponent} from '../../dialogs/wikpedia-dialog/wikipedia-dialog.component';

/**
 * Displays a card
 */
@Component({
  selector: 'app-card-fragment',
  templateUrl: './card-fragment.component.html',
  styleUrls: ['./card-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardFragmentComponent implements OnChanges {

  /** Stack the card is contained in */
  @Input() public stack = new Stack();
  /** Card to be displayed */
  @Input() public card = new Card();
  /** Indicator that timer is over */
  @Input() public isTimerOver = false;
  /** Current media */
  @Input() public media: Media;
  /** Current theme */
  @Input() public theme: Theme = Theme.BLUE;

  /** Enum for media types */
  public mediaType = Media;

  /** Dev mode */
  public devMode = false;

  /** Difficulty display long text */
  public difficultyDisplayLongText = false;
  /** Difficulty class */
  public difficultyClass = '';
  /** Difficulty text */
  public difficultyText = '';
  /** Difficulty long text */
  public difficultyLongText = '';
  /** Difficulty combined text */
  public difficultyCombinedText = '';
  /** CSS class applied to card container */
  public cardContainerClassName;
  /** CSS class applied to card */
  public cardClassName;

  /** App language */
  public language = environment.LANGUAGE;

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
  public ngOnChanges(changes: SimpleChanges) {
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
        switch (this.language) {
          case Language.GERMAN: {
            this.difficultyLongText = 'EINFACH';
            this.difficultyCombinedText = `${this.difficultyLongText} / ${this.difficultyText} Punkt`;
            break;
          }
          case Language.ENGLISH: {
            this.difficultyLongText = 'EASY';
            this.difficultyCombinedText = `${this.difficultyLongText} / ${this.difficultyText} point`;
            break;
          }
        }
        break;
      }
      case 2: {
        this.difficultyClass = 'difficultyColorMedium';
        this.difficultyText = '2';
        switch (this.language) {
          case Language.GERMAN: {
            this.difficultyLongText = 'MITTEL';
            this.difficultyCombinedText = `${this.difficultyLongText} / ${this.difficultyText} Punkte`;
            break;
          }
          case Language.ENGLISH: {
            this.difficultyLongText = 'MEDIUM';
            this.difficultyCombinedText = `${this.difficultyLongText} / ${this.difficultyText} points`;
            break;
          }
        }

        break;
      }
      case 3: {
        this.difficultyClass = 'difficultyColorHard';
        this.difficultyText = '3';
        switch (this.language) {
          case Language.GERMAN: {
            this.difficultyLongText = 'SCHWER';
            this.difficultyCombinedText = `${this.difficultyLongText} / ${this.difficultyText} Punkte`;
            break;
          }
          case Language.ENGLISH: {
            this.difficultyLongText = 'HARD';
            this.difficultyCombinedText = `${this.difficultyLongText} / ${this.difficultyText} points`;
            break;
          }
        }

        break;
      }
    }
  }

  /**
   * Initialize CSS class
   */
  private initializeCssClass() {
    this.cardContainerClassName = (this.isTimerOver) ? 'grayscale' : null;
    this.cardClassName = (this.theme === Theme.KULT) ? `${this.card.category}${this.card.difficulty}` : null;
  }

  //
  // Actions
  //

  /**
   * Handles click on help button
   */
  public onHelpClicked() {
    let action = '';
    switch (this.language) {
      case Language.GERMAN: {
        action = 'Verstanden';
        break;
      }
      case Language.ENGLISH: {
        action = 'Got it';
        break;
      }
    }

    this.dialog.open(WikipediaDialogComponent, {
      disableClose: false,
      data: {
        themeClass: this.theme,
        term: this.getTerm(this.card),
        explanationText: this.card.alternateExplanationText,
        alternateWikipediaArticle: this.card.alternateWikipediaArticle,
        alternateURL: this.card.alternateURL,
        action,
      },
      autoFocus: false,
    });
  }

  /**
   * Handles click on difficulty indicator
   */
  public onDifficultyClicked() {
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
