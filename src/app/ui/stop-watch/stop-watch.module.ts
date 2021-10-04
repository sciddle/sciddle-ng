import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {StopWatchComponent} from './stop-watch/stop-watch.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [StopWatchComponent],
  entryComponents: [StopWatchComponent],
  exports: [StopWatchComponent],
})
export class StopWatchModule {
}
