import {NgModule} from '@angular/core';
import {AboutDialogComponent} from './about-dialog/about-dialog.component';
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../material/material.module";
import {TranslocoModule} from "@ngneat/transloco";

@NgModule({
  declarations: [
    AboutDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslocoModule
  ]
})
export class AboutDialogModule {
}
