import {NgModule} from '@angular/core';
import {ConnectionService} from './services/connection.service';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ConnectionService
  ]
})
export class UtilModule {
}
