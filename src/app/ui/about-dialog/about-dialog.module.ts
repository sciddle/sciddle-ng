import {NgModule} from '@angular/core';
import {AboutDialogDeclarations} from './about-dialog.declarations';
import {AboutDialogImports} from './about-dialog.imports';
import {AboutDialogComponent} from './about-dialog/about-dialog.component';

@NgModule({
  imports: [AboutDialogImports],
  declarations: [AboutDialogDeclarations],
  entryComponents: [
    AboutDialogComponent,
  ],
  exports: [
    AboutDialogComponent,
  ],
})
export class AboutDialogModule {
}
