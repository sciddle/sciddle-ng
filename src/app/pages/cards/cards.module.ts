import {NgModule} from '@angular/core';
import {CardsComponent} from './pages/cards/cards.component';
import {CardsDeclarations} from './cards.declarations';
import {CardsImports} from './cards.imports';

@NgModule({
  imports: [CardsImports],
  declarations: [CardsDeclarations],
  entryComponents: [
    // Pages
    CardsComponent,
  ], providers: [], exports: [
    CardsComponent
  ]
})
export class CardsModule {
}
