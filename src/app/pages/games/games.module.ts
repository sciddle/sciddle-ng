import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {GamesRoutingModule} from './games-routing.module';
import {GamesComponent} from './pages/games/games.component';
import {GamesToolbarComponent} from './components/toolbars/games-toolbar/games-toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    GamesRoutingModule,

    AboutDialogModule,
  ],
  declarations: [
    // Pages
    GamesComponent,
    // Toolbars
    GamesToolbarComponent,
  ], entryComponents: [
    // Pages
    GamesComponent,
  ], providers: [], exports: [
    GamesComponent
  ]
})
export class GamesModule {
}
