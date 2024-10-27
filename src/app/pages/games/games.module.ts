import {NgModule} from '@angular/core';
import {GamesDeclarations} from './games.declarations';
import {GamesImports} from './games.imports';
import {GamesComponent} from './pages/games/games.component';
import {TranslocoModule} from "@ngneat/transloco";
import {ManualDialogModule} from "../../ui/manual-dialog/manual-dialog.module";
import {OpenSourceDialogModule} from "../../ui/open-source-dialog/open-source-dialog.module";
import {AboutDialogModule} from "../../ui/about-dialog/about-dialog.module";

@NgModule({
    imports: [GamesImports, TranslocoModule, ManualDialogModule, OpenSourceDialogModule, AboutDialogModule],
    declarations: [GamesDeclarations],
    providers: [], exports: [
        GamesComponent,
    ]
})
export class GamesModule {
}
