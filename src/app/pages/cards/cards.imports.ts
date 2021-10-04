import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SwingModule} from 'angular2-swing';
import {WikipediaModule} from '../../core/wikipedia/wikipedia.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {InformationDialogModule} from '../../ui/information-dialog/information-dialog.module';
import {MarkdownFragmentModule} from '../../ui/markdown-fragment/markdown-fragment.module';
import {MaterialModule} from '../../ui/material/material.module';
import {StopWatchModule} from '../../ui/stop-watch/stop-watch.module';
import {CardsRoutingModule} from './cards-routing.module';

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
  MarkdownFragmentModule,
  StopWatchModule,
  WikipediaModule,
];
