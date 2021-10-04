import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ConnectionService} from './services/connection.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [
    ConnectionService,
  ],
})
export class UtilModule {
}
