import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'games/0', pathMatch: 'full'},
  {path: 'games', loadChildren: './pages/games/games.module#GamesModule'},
  {path: 'games/:id', loadChildren: './pages/games/games.module#GamesModule'},
  {path: 'cards', loadChildren: './pages/cards/cards.module#CardsModule'},
  {path: 'cards/:id', loadChildren: './pages/cards/cards.module#CardsModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
