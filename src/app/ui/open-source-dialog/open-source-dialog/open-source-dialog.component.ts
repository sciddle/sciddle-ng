import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-open-source-dialog',
  templateUrl: './open-source-dialog.component.html',
  styleUrls: ['./open-source-dialog.component.scss']
})
export class OpenSourceDialogComponent implements OnInit {

  dependencies = [];

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<OpenSourceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.dependencies = Object.keys(environment.DEPENDENCIES).map((key) => {
      return `${key} ${environment.DEPENDENCIES[key]}`;
    });
  }
}
