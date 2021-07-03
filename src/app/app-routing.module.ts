import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameGuard} from './guards/game.guard';
import {ROUTE_CARDS, ROUTE_GAMES, ROUTE_STACKS} from './app.routes';

const routes: Routes = [
  {path: `${ROUTE_STACKS}`, loadChildren: () => import('./pages/stacks/stacks.module').then(m => m.StacksModule)},
  {
    path: `${ROUTE_GAMES}`,
    loadChildren: () => import('./pages/games/games.module').then(m => m.GamesModule),
    canActivate: [GameGuard]
  },
  {
    path: `${ROUTE_GAMES}/:id`,
    loadChildren: () => import('./pages/games/games.module').then(m => m.GamesModule),
    canActivate: [GameGuard]
  },
  {path: `${ROUTE_CARDS}`, loadChildren: () => import('./pages/cards/cards.module').then(m => m.CardsModule)},
  {path: `${ROUTE_CARDS}/:id`, loadChildren: () => import('./pages/cards/cards.module').then(m => m.CardsModule)},
  {path: '', redirectTo: `${ROUTE_STACKS}`, pathMatch: 'full'},
  {path: '**', redirectTo: `${ROUTE_STACKS}`, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
