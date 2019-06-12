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
  /** Action */
  action = '';

  /** Extract to the given term */
  extract;

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
    this.dialogTitle = this.data.term;
    this.term = this.data.term;
    this.action = this.data.action;
  }

  /**
   * Initializes extract
   */
  private initializeExtract() {
    const extractEmitter = new EventEmitter<{ pageURL: string, extract: string }>();
    extractEmitter.subscribe(result => {
      if (result != null && result.extract != null) {
        this.extract = result.extract;
      } else {
        this.extract = `Das Extrakt kann nicht abgerufen werden`;
      }
    });
    this.wikipediaService.getExtract(this.term, 'de', environment.API_TIMEOUT, extractEmitter);
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
