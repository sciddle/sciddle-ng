import {ChangeDetectionStrategy, Component, EventEmitter, Input, isDevMode, ViewEncapsulation} from '@angular/core';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {WikipediaService} from '../../../../../core/wikipedia/services/wikipedia.service';
import {InformationDialogComponent} from '../../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {MatDialog} from '@angular/material';
import {WikipediaDialogComponent} from '../../dialogs/wikpedia-dialog/wikipedia-dialog.component';

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
export class CardFragmentComponent {

  /** Stack the card is contained in */
  @Input() stack = new Stack();
  /** Card to be displayed */
  @Input() card = new Card();
  /** Current media */
  @Input() media: Media;

  /** Enum for media types */
  mediaType = Media;

  /** Dev mode */
  devMode = false;

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
  // Actions
  //

  /**
   * Handles click on help button
   */
  onHelpClicked() {
    this.dialog.open(WikipediaDialogComponent, {
      disableClose: false,
      data: {
        term: this.getTerm(this.card),
        action: 'Verstanden',
      },
      autoFocus: false
    });
  }

  //
  // Helpers
  //

  /**
   * Determines term to display in explanation dialog
   * @param card card
   */
  private getTerm(card: Card) {
    console.log(`this.card ${JSON.stringify(this.card)}`);

    return this.card.alternateWikipediaArticle != null && this.card.alternateWikipediaArticle !== ''
      ? this.card.alternateWikipediaArticle : this.card.word;
  }
}
