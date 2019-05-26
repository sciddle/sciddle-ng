import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameGuard} from './guards/intro.guard';

const routes: Routes = [
  {path: '', redirectTo: 'games/0', pathMatch: 'full'},
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
