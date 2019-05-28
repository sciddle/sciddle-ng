import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {GamesRoutingModule} from './games-routing.module';
import {GamesComponent} from './pages/games/games.component';
import {GamesToolbarComponent} from './components/toolbars/games-toolbar/games-toolbar.component';
import {GamesDeclarations} from './games.declarations';
import {GamesImports} from './games.imports';

@NgModule({
  imports: [GamesImports],
  declarations: [GamesDeclarations],
  entryComponents: [
    // Pages
    GamesComponent,
  ], providers: [], exports: [
    GamesComponent
  ]
})
export class GamesModule {
}
