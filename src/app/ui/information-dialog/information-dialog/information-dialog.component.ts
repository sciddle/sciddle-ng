import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

/**
 * Displays information dialog
 */
@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
})
export class InformationDialogComponent implements OnInit {

  /** Dialog title */
  public dialogTitle = '';

  /** Text to be displayed */
  public text = '';
  /** Action */
  public action = '';
  /** Value to be returned */
  public value: any;

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<InformationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  public ngOnInit() {
    this.initializeData();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.dialogTitle = this.data.title;
    this.text = this.data.text;
    this.action = this.data.action;
    this.value = this.data.value;
  }

  //
  // Button actions
  //

  /**
   * Handles click on confirm button
   */
  public confirm() {
    this.dialogRef.close(this.value);
  }
}
