import {ChangeDetectionStrategy, Component, Input, isDevMode, OnChanges, SimpleChanges} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {PaletteType} from '../../../../../core/ui/model/palette-type.enum';
import {HueType} from '../../../../../core/ui/model/hue-type.enum';

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


  /**
   * Constructor
   * @param materialColorService material color service
   */
  constructor(private materialColorService: MaterialColorService) {
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
}
