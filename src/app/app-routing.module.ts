import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameGuard} from './guards/game.guard';
import {environment} from '../environments/environment';

const routes: Routes = [
  {path: '', redirectTo: `games/${environment.DEFAULT_STACK}`, pathMatch: 'full'},
  {path: 'games', loadChildren: './pages/games/games.module#GamesModule', canActivate: [GameGuard]},
  {path: 'games/:id', loadChildren: './pages/games/games.module#GamesModule', canActivate: [GameGuard]},
  {path: 'cards', loadChildren: './pages/cards/cards.module#CardsModule'},
  {path: 'cards/:id', loadChildren: './pages/cards/cards.module#CardsModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
