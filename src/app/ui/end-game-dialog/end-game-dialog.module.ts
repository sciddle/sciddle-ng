import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndGameDialogComponent } from './end-game-dialog/end-game-dialog.component';
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
  declarations: [
    EndGameDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    TranslocoModule
  ]
})
export class EndGameDialogModule { }
