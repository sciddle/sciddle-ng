import {LOCALE_ID, NgModule} from '@angular/core';

import {OverlayContainer} from '@angular/cdk/overlay';
import {AppComponent} from './app.component';
import {AppImports} from './app.imports';
import {AppProviders} from './app.providers';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [AppImports],
  providers: [AppProviders,
    {provide: LOCALE_ID, useValue: 'en'}],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('blue-theme');
  }
}
