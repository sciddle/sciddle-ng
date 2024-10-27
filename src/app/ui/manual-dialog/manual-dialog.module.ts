import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManualDialogComponent} from './manual-dialog/manual-dialog.component';
import {MaterialModule} from "../material/material.module";
import {CapitalizeSentencesPipe} from "../../pipes/capitalize-sentences.pipe";
import {TranslocoModule} from "@ngneat/transloco";


@NgModule({
  declarations: [
    ManualDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslocoModule,
    CapitalizeSentencesPipe,
  ]
})
export class ManualDialogModule {
}
