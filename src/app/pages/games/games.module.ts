import {NgModule} from '@angular/core';
import {GamesComponent} from './pages/games/games.component';
import {GamesDeclarations} from './games.declarations';
import {GamesImports} from './games.imports';
import { MultiplayerGameDialogComponent } from './components/dialogs/multiplayer-game-dialog/multiplayer-game-dialog.component';

@NgModule({
  imports: [GamesImports],
  declarations: [GamesDeclarations],
  entryComponents: [
    // Pages
    GamesComponent,
    // Dialogs
    MultiplayerGameDialogComponent
  ], providers: [], exports: [
    GamesComponent
  ]
})
export class GamesModule {
}
