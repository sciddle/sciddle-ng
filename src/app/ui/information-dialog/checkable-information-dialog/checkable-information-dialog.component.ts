import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MediaService} from '../../../core/ui/services/media.service';

/**
 * Displays checkable information dialog
 */
@Component({
  selector: 'app-checkable-information-dialog',
  templateUrl: './checkable-information-dialog.component.html',
  styleUrls: ['./checkable-information-dialog.component.scss'],
})
export class CheckableInformationDialogComponent implements OnInit {

  /** Dialog title */
  public dialogTitle = '';

  /** Text to be displayed */
  public text = '';
  /** Checkbox value */
  public checkboxValue: false;
  /** Checkbox text */
  public checkboxText = '';
  /** Action */
  public action = '';

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   * @param mediaService media service
   */
  constructor(public dialogRef: MatDialogRef<CheckableInformationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mediaService: MediaService) {
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
    this.checkboxValue = this.data.checkboxValue;
    this.checkboxText = this.data.checkboxText;
    this.action = this.data.action;
  }

  //
  // Actions
  //

  /**
   * Handles change of checkbox value
   * @param event selection state
   */
  public onCheckboxChanged(event: any) {
    this.checkboxValue = event.checked;
  }

  //
  // Button actions
  //

  /**
   * Handles click on confirm button
   */
  public confirm() {
    this.dialogRef.close({checkboxValue: this.checkboxValue});
  }
}
