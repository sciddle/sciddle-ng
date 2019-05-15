import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {CardsRoutingModule} from './cards-routing.module';
import {CardsComponent} from './pages/cards/cards.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    CardsRoutingModule,
  ],
  declarations: [
    // Pages
    CardsComponent,
  ], entryComponents: [
    // Pages
    CardsComponent,
  ], providers: [], exports: [
    CardsComponent
  ]
})
export class CardsModule {
}
