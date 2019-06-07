import {NgModule} from '@angular/core';
import {GamesComponent} from './pages/games/games.component';
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
