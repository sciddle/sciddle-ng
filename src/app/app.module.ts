import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppImports} from './app.imports';
import {AppProviders} from './app.providers';
import { CardsComponent } from './pages/cards/pages/cards/cards.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [AppImports],
  providers: [AppProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
