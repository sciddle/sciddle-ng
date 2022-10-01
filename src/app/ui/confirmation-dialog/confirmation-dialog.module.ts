import {NgModule} from '@angular/core';
import {ConfirmationDialogDeclarations} from './confirmation-dialog.declarations';
import {ConfirmationDialogImports} from './confirmation-dialog.imports';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
    imports: [ConfirmationDialogImports],
    declarations: [ConfirmationDialogDeclarations],
    exports: [
        ConfirmationDialogComponent,
    ]
})
export class ConfirmationDialogModule {
}
