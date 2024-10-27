import {LOCALE_ID, NgModule} from '@angular/core';

import {OverlayContainer} from '@angular/cdk/overlay';
import {AppComponent} from './app.component';
import {AppImports} from './app.imports';
import {AppProviders} from './app.providers';
import {translocoLoader} from "./transloco.loader";
import {TranslocoUndefMissingHandler} from "./transloco-missing-handler";
import {TRANSLOCO_CONFIG, TRANSLOCO_MISSING_HANDLER, TranslocoConfig} from "@ngneat/transloco";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [AppImports],
  providers: [
    AppProviders,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: ['de', 'en'],
        listenToLangChange: false,
        defaultLang: 'de',
        fallbackLang: ['de', 'en'],
        prodMode: environment.production,
      } as TranslocoConfig,
    },
    {
      provide: TRANSLOCO_MISSING_HANDLER,
      useClass: TranslocoUndefMissingHandler,
    },
    translocoLoader,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('blue-theme');
  }
}
