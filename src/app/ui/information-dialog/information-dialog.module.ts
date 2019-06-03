import {NgModule} from '@angular/core';
import {InformationDialogComponent} from './information-dialog/information-dialog.component';
import {InformationDialogDeclarations} from './information-dialog.declarations';
import {InformationDialogImports} from './information-dialog.imports';

@NgModule({
  imports: [InformationDialogImports],
  declarations: [InformationDialogDeclarations],
  entryComponents: [
    InformationDialogComponent
  ],
  exports: [
    InformationDialogComponent
  ]
})
export class InformationDialogModule {
}
