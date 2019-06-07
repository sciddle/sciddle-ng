import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StacksComponent} from './pages/stacks/stacks.component';

const routes: Routes = [
  {path: '', component: StacksComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StacksRoutingModule {
}
