import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {InformationDialogModule} from '../../ui/information-dialog/information-dialog.module';
import {StacksRoutingModule} from './stacks-routing.module';
import {HttpClientModule} from '@angular/common/http';

/**
 * Imports of stacks module
 */
export const StacksImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  MaterialModule,

  StacksRoutingModule,

  AboutDialogModule,
  InformationDialogModule
];
