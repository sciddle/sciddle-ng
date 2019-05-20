import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'cards/0', pathMatch: 'full'},
  {path: 'cards', loadChildren: './pages/cards/cards.module#CardsModule'},
  {path: 'cards/:id', loadChildren: './pages/cards/cards.module#CardsModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
