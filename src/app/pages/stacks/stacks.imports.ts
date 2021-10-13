import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {InformationDialogModule} from '../../ui/information-dialog/information-dialog.module';
import {MaterialModule} from '../../ui/material/material.module';
import {StacksRoutingModule} from './stacks-routing.module';

/**
 * Imports of stacks module
 */
export const StacksImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  MaterialModule,
  ScrollingModule,

  StacksRoutingModule,

  AboutDialogModule,
  InformationDialogModule,
];
