import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CardsComponent} from './pages/cards/cards.component';
import {StackResolver} from './resolvers/stack.resolver';

const routes: Routes = [
  {path: '', component: CardsComponent},
  {path: 'cards/:uid', component: CardsComponent, resolve: {stack: StackResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsRoutingModule {
}
