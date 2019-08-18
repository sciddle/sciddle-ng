import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WikipediaService} from '../../../../../core/wikipedia/services/wikipedia.service';
import {environment} from '../../../../../../environments/environment';

/**
 * Displays wikipedia dialog
 */
@Component({
  selector: 'app-wikipedia-dialog',
  templateUrl: './wikipedia-dialog.component.html',
  styleUrls: ['./wikipedia-dialog.component.scss']
})
export class WikipediaDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Term to be displayed */
  term = '';
  /** Explanation text */
  explanationText;
  /** Alternate Wikipedia article */
  alternateWikipediaArticle;
  /** Alternate URL */
  alternateURL;
  /** Action */
  action = '';

  //
  // Static methods
  //

  /**
   * Returns m characters minimum + the consecutive n sentences of a given text
   * @param text text
   * @param n number of sentences
   * @param m minimum characters
   */
  static getFirstSentences(text: string, n: number, m: number): string {
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
   * @param wikipediaService wikipedia service
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<WikipediaDialogComponent>,
              private wikipediaService: WikipediaService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
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
    this.action = this.data.action;
  }

  /**
   * Initializes extract
   */
  private initializeExtract() {
    if (this.alternateURL != null) {
      this.explanationText = `Mehr auf [${this.alternateURL}](${this.alternateURL})`;
    } else {
      const article = this.alternateWikipediaArticle == null ? this.term : this.alternateWikipediaArticle;
      const extractEmitter = new EventEmitter<{ pageURL: string, extract: string }>();
      extractEmitter.subscribe(result => {
        if (result != null && result.extract != null) {
          const extract = this.explanationText == null
            ? WikipediaDialogComponent.getFirstSentences(result.extract, 2, 100)
            : this.explanationText;
          const more = result.pageURL != null
            ? ` Mehr auf [Wikipedia](` + result.pageURL.replace(' ', '%20') + `)`
            : ``;

          this.explanationText = extract + more;
        } else {
          this.explanationText = `Das Extrakt kann nicht abgerufen werden`;
        }
      });
      this.wikipediaService.getExtract(article, 'de', environment.API_TIMEOUT, environment.API_DELAY, extractEmitter);
    }
  }

  //
  // Button actions
  //

  /**
   * Handles click on confirm button
   */
  confirm() {
    this.dialogRef.close();
  }
}
