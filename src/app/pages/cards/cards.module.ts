import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {CardsRoutingModule} from './cards-routing.module';
import {CardsComponent} from './pages/cards/cards.component';
import {CardsToolbarComponent} from './components/toolbars/cards-toolbar/cards-toolbar.component';
import {SwingModule} from 'angular2-swing';
import {CardFragmentComponent} from './components/fragments/card-fragment/card-fragment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    SwingModule,

    CardsRoutingModule,
  ],
  declarations: [
    // Pages
    CardsComponent,
    // Toolbars
    CardsToolbarComponent,
    // Fragments
    CardFragmentComponent,
  ], entryComponents: [
    // Pages
    CardsComponent,
  ], providers: [], exports: [
    CardsComponent
  ]
})
export class CardsModule {
}
