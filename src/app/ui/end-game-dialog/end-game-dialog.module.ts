import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndGameDialogComponent } from './end-game-dialog/end-game-dialog.component';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
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
