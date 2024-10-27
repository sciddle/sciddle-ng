import {NgModule} from '@angular/core';
import {StacksComponent} from './pages/stacks/stacks.component';
import {StacksDeclarations} from './stacks.declarations';
import {StacksImports} from './stacks.imports';
import {TranslocoModule} from "@ngneat/transloco";
import {AboutDialogModule} from "../../ui/about-dialog/about-dialog.module";
import {OpenSourceDialogModule} from "../../ui/open-source-dialog/open-source-dialog.module";
import {ManualDialogModule} from "../../ui/manual-dialog/manual-dialog.module";

@NgModule({
  declarations: [StacksDeclarations],
  imports: [StacksImports, TranslocoModule, ManualDialogModule, OpenSourceDialogModule, AboutDialogModule],
  exports: [
    StacksComponent,
  ]
})
export class StacksModule {
}
