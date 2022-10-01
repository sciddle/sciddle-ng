import {NgModule} from '@angular/core';
import {CardsDeclarations} from './cards.declarations';
import {CardsImports} from './cards.imports';
import {WikipediaDialogComponent} from './components/dialogs/wikpedia-dialog/wikipedia-dialog.component';
import {CardsComponent} from './pages/cards/cards.component';

@NgModule({
    imports: [CardsImports],
    declarations: [CardsDeclarations],
    providers: [], exports: [
        CardsComponent,
    ]
})
export class CardsModule {
}
