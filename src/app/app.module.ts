import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppImports} from './app.imports';
import {AppProviders} from './app.providers';
import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {GestureConfig} from '@angular/material';
import {OverlayContainer} from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [AppImports],
  providers: [AppProviders, {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig}],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('blue-theme');
  }
}
