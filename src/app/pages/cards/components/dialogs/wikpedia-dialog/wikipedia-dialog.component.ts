import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WikipediaService} from '../../../../../core/wikipedia/services/wikipedia.service';
import {environment} from '../../../../../../environments/environment';
import {Language} from '../../../../../core/language/model/language.enum';

/**
 * Displays wikipedia dialog
 */
@Component({
  selector: 'app-wikipedia-dialog',
  templateUrl: './wikipedia-dialog.component.html',
  styleUrls: ['./wikipedia-dialog.component.scss']
})
export class WikipediaDialogComponent implements OnInit {

  /** Default theme to be used */
  themeClass = 'blue-theme';
  /** Dialog title */
  dialogTitle = '';

  /** Term to be displayed */
  term = '';
  /** Explanation text */
  explanationText;
  /** Text to more information */
  more;
  /** Link to more information */
  moreLink;
  /** Alternate Wikipedia article */
  alternateWikipediaArticle;
  /** Alternate URL */
  alternateURL;
  /** Action */
  action = '';

  /** App language */
  language = environment.LANGUAGE;

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
    this.themeClass = this.data.themeClass;
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

      switch (this.language) {
        case Language.GERMAN: {
          this.more = `Mehr auf ${this.alternateURL}`;
          break;
        }
        case Language.ENGLISH: {
          this.more = `Find more on ${this.alternateURL}`;
          break;
        }
      }

      this.moreLink = this.alternateURL;
    } else {
      const article = this.alternateWikipediaArticle == null ? this.term : this.alternateWikipediaArticle;
      const extractEmitter = new EventEmitter<{ pageURL: string, extract: string }>();
      extractEmitter.subscribe(result => {
        if (result != null && result.extract != null) {
          this.explanationText = this.explanationText == null
            ? WikipediaDialogComponent.getFirstSentences(result.extract, 2, 100)
            : this.explanationText;

          switch (this.language) {
            case Language.GERMAN: {
              this.more = result.pageURL != null ? ` Mehr auf Wikipedia` : ``;
              break;
            }
            case Language.ENGLISH: {
              this.more = result.pageURL != null ? ` Find more on Wikipedia` : ``;
              break;
            }
          }

          this.moreLink = result.pageURL.replace(' ', '%20');
        } else {
          switch (this.language) {
            case Language.GERMAN: {
              this.explanationText = `Das Extrakt kann nicht abgerufen werden`;
              break;
            }
            case Language.ENGLISH: {
              this.explanationText = `Cannot get extract`;
              break;
            }
          }
        }
      });
      this.wikipediaService.getExtract(article, this.language, environment.API_TIMEOUT, environment.API_DELAY, extractEmitter);
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
