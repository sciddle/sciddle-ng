import {NgModule} from '@angular/core';
import {CheckableInformationDialogComponent} from './checkable-information-dialog/checkable-information-dialog.component';
import {InformationDialogDeclarations} from './information-dialog.declarations';
import {InformationDialogImports} from './information-dialog.imports';
import {InformationDialogComponent} from './information-dialog/information-dialog.component';

@NgModule({
  imports: [InformationDialogImports],
  declarations: [InformationDialogDeclarations],
  entryComponents: [
    InformationDialogComponent,
    CheckableInformationDialogComponent,
  ],
  exports: [
    InformationDialogComponent,
    CheckableInformationDialogComponent,
  ],
})
export class InformationDialogModule {
}
