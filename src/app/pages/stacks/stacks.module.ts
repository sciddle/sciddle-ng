import {LOCALE_ID, NgModule} from '@angular/core';
import {StacksImports} from './stacks.imports';
import {StacksDeclarations} from './stacks.declarations';
import {StacksComponent} from './pages/stacks/stacks.component';

@NgModule({
  declarations: [StacksDeclarations],
  imports: [StacksImports],
  entryComponents: [
    // Pages
    StacksComponent,
  ], providers: [
    {provide: LOCALE_ID, useValue: 'en'}
  ], exports: [
    StacksComponent
  ]
})
export class StacksModule {
}
