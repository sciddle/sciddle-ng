import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {GamesRoutingModule} from './games-routing.module';

/**
 * Imports of games module
 */
export const GamesImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MaterialModule,

  GamesRoutingModule
];
