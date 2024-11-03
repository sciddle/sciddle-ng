import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {environment} from '../../../../../../environments/environment';
import {WikipediaService} from '../../../../../core/wikipedia/services/wikipedia.service';
import {TranslocoService} from "@ngneat/transloco";

/**
 * Displays wikipedia dialog
 */
@Component({
  selector: 'app-wikipedia-dialog',
  templateUrl: './wikipedia-dialog.component.html',
  styleUrls: ['./wikipedia-dialog.component.scss'],
})
export class WikipediaDialogComponent implements OnInit {

  /** Dialog title */
  public dialogTitle = '';

  /** Term to be displayed */
  public term = '';
  /** Explanation text */
  public explanationText;
  /** Text to more information */
  public more;
  /** Link to more information */
  public moreLink;
  /** Alternate Wikipedia article */
  public alternateWikipediaArticle;
  /** Alternate URL */
  public alternateURL;

  //
  // Static methods
  //

  /**
   * Returns m characters minimum + the consecutive n sentences of a given text
   * @param text text
   * @param n number of sentences
   * @param m minimum characters
   */
  public static getFirstSentences(text: string, n: number, m: number): string {
    const separator = '. ';

    return text.slice(0, m) // Take first m characters
      + text.slice(m) // Take everything after first m characters
        .split(separator) // Split into array of sentences
        .slice(0, n) // Take first n sentences
        .join(separator) // Link sentences back together
        .replace(/\.\s*/g, '. ') // Add blanks after period if needed
      + '.';
  }

  /**
   * Constructor
   * @param data dialog data
   * @param dialogRef dialog reference
   * @param translocoService transloco service
   * @param wikipediaService wikipedia service
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<WikipediaDialogComponent>,
              private translocoService: TranslocoService,
              private wikipediaService: WikipediaService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  public ngOnInit() {
    this.initializeData();
    this.initializeExtract();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.dialogTitle = this.data.term.replace(/_/g, ' ');
    this.term = this.data.term;
    this.explanationText = this.data.explanationText;
    this.alternateWikipediaArticle = this.data.alternateWikipediaArticle;
    this.alternateURL = this.data.alternateURL;
  }

  /**
   * Initializes extract
   */
  private initializeExtract() {
    if (this.alternateURL != null) {
      this.more = this.translocoService.translate("dialogs.wikipedia.terms.more-on", {ur: this.alternateURL});
      this.moreLink = this.alternateURL;
    } else {
      const article = this.alternateWikipediaArticle == null ? this.term : this.alternateWikipediaArticle;
      const extractEmitter = new EventEmitter<{ pageURL: string, extract: string }>();
      extractEmitter.subscribe((result) => {
        if (result != null && result.extract != null) {
          this.explanationText = (this.explanationText == null
            ? WikipediaDialogComponent.getFirstSentences(result.extract, 2, 100)
            : this.explanationText).replace(/\.\./g, '.').replace(/\.\s\./g, '.');

          this.more = result.pageURL != null ? this.translocoService.translate("dialogs.wikipedia.terms.more-on-wikipedia") : ``;
          this.moreLink = result.pageURL.replace(' ', '%20');
        } else {
          this.explanationText = this.translocoService.translate("dialogs.wikipedia.messages.cannot-get-abstract");
        }
      });
      this.wikipediaService.getExtract(article, this.translocoService.getActiveLang(), environment.API_TIMEOUT, environment.API_DELAY, extractEmitter);
    }
  }

  //
  // Button actions
  //

  /**
   * Handles click on confirm button
   */
  public confirm() {
    this.dialogRef.close();
  }
}
