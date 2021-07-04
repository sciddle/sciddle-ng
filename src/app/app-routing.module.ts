import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ROUTE_CARDS, ROUTE_GAMES, ROUTE_STACKS} from './app.routes';
import {GameGuard} from './guards/game.guard';

const routes: Routes = [
  {path: `${ROUTE_STACKS}`, loadChildren: () => import('./pages/stacks/stacks.module').then((m) => m.StacksModule)},
  {
    canActivate: [GameGuard],
    loadChildren: () => import('./pages/games/games.module').then((m) => m.GamesModule),
    path: `${ROUTE_GAMES}`,
  },
  {
    canActivate: [GameGuard],
    loadChildren: () => import('./pages/games/games.module').then((m) => m.GamesModule),
    path: `${ROUTE_GAMES}/:id`,
  },
  {path: `${ROUTE_CARDS}`, loadChildren: () => import('./pages/cards/cards.module').then((m) => m.CardsModule)},
  {path: `${ROUTE_CARDS}/:id`, loadChildren: () => import('./pages/cards/cards.module').then((m) => m.CardsModule)},
  {path: '', redirectTo: `${ROUTE_STACKS}`, pathMatch: 'full'},
  {path: '**', redirectTo: `${ROUTE_STACKS}`, pathMatch: 'full'},
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
})
export class AppRoutingModule {
}
