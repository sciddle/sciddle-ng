import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Variant} from '../../../core/util/model/variant.enum';

/**
 * Displays about dialog
 */
@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss'],
})
export class AboutDialogComponent implements OnInit {

  /** Default theme to be used */
  public themeClass = 'blue-theme';
  /** Dialog title */
  public dialogTitle = '';

  /** App name */
  public name = '';
  /** App version */
  public version = '';
  /** Author of code */
  public authorCode;
  /** Author of code's URL */
  public authorCodeUrl;
  /** Author of original idea */
  public authorOriginal;
  /** Author of content */
  public authorContent;
  /** Author of graphics */
  public authorGraphics;
  /** Author of graphics' URL */
  public authorGraphicsUrl;
  /** Scientific supervision */
  public authorScientificSupervision;
  /** Github URL */
  public githubUrl;
  /** License of code */
  public licenseCode;
  /** License of content */
  public licenseContent;
  /** App homepage */
  public homepage;
  /** Variant */
  public variant: Variant;

  /** Variant type sciddle */
  public variantTypeSciddle = Variant.SCIDDLE;

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
