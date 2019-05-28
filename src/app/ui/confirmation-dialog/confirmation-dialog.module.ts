import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {MaterialModule} from '../material/material.module';
import {ConfirmationDialogImports} from './confirmation-dialog.imports';
import {ConfirmationDialogDeclarations} from './confirmation-dialog.declarations';

@NgModule({
  imports: [ConfirmationDialogImports],
  declarations: [ConfirmationDialogDeclarations],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  exports: [
    ConfirmationDialogComponent
  ]
})
export class ConfirmationDialogModule {
}
