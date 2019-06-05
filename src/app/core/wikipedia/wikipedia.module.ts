import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WikipediaProviders} from './wikipedia.providers';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [WikipediaProviders]
})
export class WikipediaModule {
}
