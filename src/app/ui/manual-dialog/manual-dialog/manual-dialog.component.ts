import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {TranslocoService} from "@ngneat/transloco";
import {environment} from "../../../../environments/environment";

/**
 * Displays manual dialog
 */
@Component({
  selector: 'app-manual-dialog',
  templateUrl: './manual-dialog.component.html',
  styleUrls: ['./manual-dialog.component.scss']
})
export class ManualDialogComponent {

  appName = environment.APP_NAME;

  /** Checkbox value */
  public checkboxValue: false;

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<ManualDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
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

  /**
   * Handles click on confirm button
   */
  public confirm() {
    this.dialogRef.close({checkboxValue: this.checkboxValue});
  }
}
