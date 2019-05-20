import {NgModule} from '@angular/core';
import {AboutDialogComponent} from './about-dialog/about-dialog.component';
import {AboutDialogImports} from './about-dialog.imports';

@NgModule({
  imports: [AboutDialogImports],
  declarations: [
    AboutDialogComponent
  ],
  entryComponents: [
    AboutDialogComponent
  ],
  exports: [
    AboutDialogComponent
  ]
})
export class AboutDialogModule {
}
