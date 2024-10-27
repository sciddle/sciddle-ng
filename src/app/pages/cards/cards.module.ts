import {NgModule} from '@angular/core';
import {CardsDeclarations} from './cards.declarations';
import {CardsImports} from './cards.imports';
import {CardsComponent} from './pages/cards/cards.component';
import {TranslocoModule} from "@ngneat/transloco";
import {ManualDialogModule} from "../../ui/manual-dialog/manual-dialog.module";
import {OpenSourceDialogModule} from "../../ui/open-source-dialog/open-source-dialog.module";
import {AboutDialogModule} from "../../ui/about-dialog/about-dialog.module";
import {CapitalizeSentencesPipe} from "../../pipes/capitalize-sentences.pipe";
import {EndGameDialogModule} from "../../ui/end-game-dialog/end-game-dialog.module";

@NgModule({
  imports: [CardsImports, TranslocoModule, ManualDialogModule, OpenSourceDialogModule, AboutDialogModule,
    EndGameDialogModule, CapitalizeSentencesPipe],
  declarations: [CardsDeclarations],
  providers: [], exports: [
    CardsComponent,
  ]
})
export class CardsModule {
}
