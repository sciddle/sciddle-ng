import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ROUTE_CARDS, ROUTE_GAMES, ROUTE_STACKS} from './app.routes';
import {GameGuard} from './guards/game.guard';

const routes: Routes = [
  {path: `${ROUTE_STACKS}`, redirectTo: `${ROUTE_GAMES}`, pathMatch: 'full'},
  {
    canActivate: [GameGuard],
    loadChildren: () => import('./pages/games/games.module').then((m) => m.GamesModule),
    path: `${ROUTE_GAMES}/:id`,
  },
  {path: `${ROUTE_CARDS}`, loadChildren: () => import('./pages/cards/cards.module').then((m) => m.CardsModule)},
  {path: '', redirectTo: `${ROUTE_GAMES}`, pathMatch: 'full'},
  {path: '**', redirectTo: `${ROUTE_GAMES}`},
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
})
export class AppRoutingModule {
}
