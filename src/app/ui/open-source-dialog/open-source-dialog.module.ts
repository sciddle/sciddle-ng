import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpenSourceDialogComponent} from './open-source-dialog/open-source-dialog.component';
import {TranslocoModule} from "@ngneat/transloco";
import {MaterialModule} from "../material/material.module";
import {CapitalizeSentencesPipe} from "../../pipes/capitalize-sentences.pipe";

@NgModule({
  declarations: [
    OpenSourceDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslocoModule,
    CapitalizeSentencesPipe,
  ]
})
export class OpenSourceDialogModule {
}
