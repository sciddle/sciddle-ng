import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ROUTE_CARDS, ROUTE_GAMES, ROUTE_STACKS} from './app.routes';
import {GameGuard} from './guards/game.guard';

const routes: Routes = [
  {path: `${ROUTE_STACKS}`, redirectTo: `${ROUTE_GAMES}`, pathMatch: 'full'},
  {path: `${ROUTE_GAMES}`, loadChildren: './pages/games/games.module#GamesModule', canActivate: [GameGuard]},
  {path: `${ROUTE_CARDS}`, loadChildren: './pages/cards/cards.module#CardsModule'},
  {path: '', redirectTo: `${ROUTE_GAMES}`, pathMatch: 'full'},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
