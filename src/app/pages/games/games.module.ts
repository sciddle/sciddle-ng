import {NgModule} from '@angular/core';
import { MultiplayerGameDialogComponent } from './components/dialogs/multiplayer-game-dialog/multiplayer-game-dialog.component';
import {GamesDeclarations} from './games.declarations';
import {GamesImports} from './games.imports';
import {GamesComponent} from './pages/games/games.component';

@NgModule({
    imports: [GamesImports],
    declarations: [GamesDeclarations],
    providers: [], exports: [
        GamesComponent,
    ]
})
export class GamesModule {
}
