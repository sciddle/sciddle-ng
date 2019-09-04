import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameGuard} from './guards/game.guard';
import {environment} from '../environments/environment';
import {ROUTE_CARDS, ROUTE_GAMES, ROUTE_STACKS} from './app.routes';

const routes: Routes = [
  {path: `${ROUTE_STACKS}`, loadChildren: './pages/stacks/stacks.module#StacksModule'},
  {path: `${ROUTE_GAMES}`, loadChildren: './pages/games/games.module#GamesModule', canActivate: [GameGuard]},
  {path: `${ROUTE_GAMES}/:id`, loadChildren: './pages/games/games.module#GamesModule', canActivate: [GameGuard]},
  {path: `${ROUTE_CARDS}`, loadChildren: './pages/cards/cards.module#CardsModule'},
  {path: `${ROUTE_CARDS}/:id`, loadChildren: './pages/cards/cards.module#CardsModule'},
  {path: '', redirectTo: `${ROUTE_STACKS}`, pathMatch: 'full'},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
