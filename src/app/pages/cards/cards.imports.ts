import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {SwingModule} from 'angular2-swing';
import {CardsRoutingModule} from './cards-routing.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {HttpClientModule} from '@angular/common/http';
import {StopWatchModule} from '../../ui/stop-watch/stop-watch.module';
import {InformationDialogModule} from '../../ui/information-dialog/information-dialog.module';

/**
 * Imports of cards module
 */
export const CardsImports = [
  CommonModule,
  FormsModule,
  HttpClientModule,
  ReactiveFormsModule,
  MaterialModule,

  SwingModule,

  CardsRoutingModule,

  AboutDialogModule,
  ConfirmationDialogModule,
  InformationDialogModule,
  StopWatchModule
];
