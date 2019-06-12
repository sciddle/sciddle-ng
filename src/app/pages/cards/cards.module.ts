import {NgModule} from '@angular/core';
import {CardsComponent} from './pages/cards/cards.component';
import {CardsDeclarations} from './cards.declarations';
import {CardsImports} from './cards.imports';
import {WikipediaDialogComponent} from './components/dialogs/wikpedia-dialog/wikipedia-dialog.component';

@NgModule({
  imports: [CardsImports],
  declarations: [CardsDeclarations],
  entryComponents: [
    // Pages
    CardsComponent,
    // Dialogs
    WikipediaDialogComponent
  ], providers: [], exports: [
    CardsComponent
  ]
})
export class CardsModule {
}
