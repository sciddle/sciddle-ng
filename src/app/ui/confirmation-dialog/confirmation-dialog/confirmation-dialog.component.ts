import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

/**
 * Displays confirmation dialog
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {

  /** Dialog title */
  public dialogTitle = '';

  /** Text to be displayed */
  public text = '';
  /** Action */
  public action = '';
  /** Negative action */
  public negativeAction = '';
  /** Value to be returned */
  public value: any;

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
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
    this.negativeAction = this.data.negativeAction;
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
