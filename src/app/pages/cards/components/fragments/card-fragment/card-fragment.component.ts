import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  isDevMode,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {PaletteType} from '../../../../../core/ui/model/palette-type.enum';
import {HueType} from '../../../../../core/ui/model/hue-type.enum';
import {WikipediaService} from '../../../../../core/wikipedia/services/wikipedia.service';
import {InformationDialogComponent} from '../../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {MatDialog} from '@angular/material';

/**
 * Displays a card
 */
@Component({
  selector: 'app-card-fragment',
  templateUrl: './card-fragment.component.html',
  styleUrls: ['./card-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFragmentComponent implements OnChanges {

  /** Stack the card is contained in */
  @Input() stack = new Stack();
  /** Card to be displayed */
  @Input() card = new Card();
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

  //
  // Static methods
  //

  /**
   * Returns the first n sentences of a given text
   * @param text text
   * @param n number of sentences
   * @param m minimum characters
   */
  static getFirstSentences(text: string, n: number, m: number): string {
    const separator = '. ';

    return text.slice(0, m) + text.slice(m).split(separator).slice(0, n).join(separator) + '.';
  }

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
  ngOnChanges(changes: SimpleChanges): void {
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
    if (this.card != null) {
      switch (this.card.difficulty) {
        case 1: {
          this.difficultyColor = this.materialColorService.color(PaletteType.GREEN, HueType._500);
          break;
        }
        case 2: {
          this.difficultyColor = this.materialColorService.color(PaletteType.AMBER, HueType._400);
          break;
        }
        case 3: {
          this.difficultyColor = this.materialColorService.color(PaletteType.RED, HueType._500);
          break;
        }
      }
    }
  }

  //
  // Actions
  //

  /**
   * Handles click on help button
   */
  onHelpClicked() {
    const abstractEmitter = new EventEmitter<{ pageURL: string, extract: string }>();
    abstractEmitter.subscribe(result => {
      this.dialog.open(InformationDialogComponent, {
        disableClose: false,
        data: {
          title: this.card.word,
          text: CardFragmentComponent.getFirstSentences(result.extract, 2, 100) + ` Mehr auf [Wikipedia](` + result.pageURL + `)`,
          action: 'Verstanden',
          value: null
        },
        autoFocus: false
      });
    });
    this.wikipediaService.getExtract(this.card.word, 'de', abstractEmitter);
  }
}
