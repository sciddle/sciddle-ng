import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {WelcomeRoutingModule} from './welcome-routing.module';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    WelcomeRoutingModule,

    AboutDialogModule,
  ]
})
export class WelcomeModule {
}
