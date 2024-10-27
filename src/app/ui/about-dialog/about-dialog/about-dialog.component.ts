import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {environment} from "../../../../environments/environment";

/**
 * Displays about dialog
 */
@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss'],
})
export class AboutDialogComponent {

  appName = environment.APP_NAME;
  version = environment.VERSION;
  variant = environment.VARIANT;
  authorOriginal = environment.AUTHOR_ORIGINAL;
  authorContent = environment.AUTHOR_CONTENT
  licenseContent = environment.LICENSE_CONTENT;
  licenseCode = environment.LICENSE_CODE;
  authorGraphics = environment.AUTHOR_GRAPHICS;
  authorGraphicsUrl = environment.AUTHOR_GRAPHICS_URL;
  authorCode = environment.AUTHOR_CODE;
  authorCodeUrl = environment.AUTHOR_CODE_URL;
  githubUrl = environment.GITHUB_URL;
  authorScientificSupervision = environment.AUTHOR_SCIENTIFIC_SUPERVISION

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<AboutDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
