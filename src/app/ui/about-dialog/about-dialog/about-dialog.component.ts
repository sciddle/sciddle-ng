import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Variant} from '../../../core/util/model/variant.enum';

/**
 * Displays about dialog
 */
@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit {

  /** Default theme to be used */
  themeClass = 'blue-theme';
  /** Dialog title */
  dialogTitle = '';

  /** App name */
  name = '';
  /** App version */
  version = '';
  /** Author of code */
  authorCode;
  /** Author of code's URL */
  authorCodeUrl;
  /** Author of original idea */
  authorOriginal;
  /** Author of content */
  authorContent;
  /** Author of graphics */
  authorGraphics;
  /** Author of graphics' URL */
  authorGraphicsUrl;
  /** Scientific supervision */
  authorScientificSupervision;
  /** Github URL */
  githubUrl;
  /** License of code */
  licenseCode;
  /** License of content */
  licenseContent;
  /** App homepage */
  homepage;
  /** Variant */
  variant: Variant;

  /** Variant type sciddle */
  variantTypeSciddle = Variant.SCIDDLE;

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<AboutDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeData();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.themeClass = this.data.themeClass;
    this.dialogTitle = this.data.title;
    this.name = this.data.name;
    this.version = this.data.version;
    this.authorCode = this.data.authorCode;
    this.authorCodeUrl = this.data.authorCodeUrl;
    this.authorOriginal = this.data.authorOriginal;
    this.authorContent = this.data.authorContent;
    this.authorGraphics = this.data.authorGraphics;
    this.authorGraphicsUrl = this.data.authorGraphicsUrl;
    this.authorScientificSupervision = this.data.authorScientificSupervision;
    this.githubUrl = this.data.githubUrl;
    this.licenseCode = this.data.licenseCode;
    this.licenseContent = this.data.licenseContent;
    this.homepage = this.data.homepage;
    this.variant = this.data.variant;
  }
}
