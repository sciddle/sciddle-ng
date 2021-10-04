import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {WikipediaProviders} from './wikipedia.providers';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [WikipediaProviders],
})
export class WikipediaModule {
}
