import {NgModule} from '@angular/core';
import {LogProviders} from './log.providers';
import {LogImports} from './log.imports';

@NgModule({
  declarations: [],
  imports: [LogImports],
  providers: [LogProviders]
})
export class LogModule {
}
