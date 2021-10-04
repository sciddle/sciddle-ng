import {LOCALE_ID, NgModule} from '@angular/core';
import {StacksComponent} from './pages/stacks/stacks.component';
import {StacksDeclarations} from './stacks.declarations';
import {StacksImports} from './stacks.imports';

@NgModule({
  declarations: [StacksDeclarations],
  imports: [StacksImports],
  entryComponents: [
    // Pages
    StacksComponent,
  ], providers: [
    {provide: LOCALE_ID, useValue: 'en'},
  ], exports: [
    StacksComponent,
  ],
})
export class StacksModule {
}
