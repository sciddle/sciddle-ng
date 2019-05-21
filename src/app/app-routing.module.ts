import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'welcome', pathMatch: 'full'},
  {path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomeModule'},
  {path: 'cards', loadChildren: './pages/cards/cards.module#CardsModule'},
  {path: 'cards/:id', loadChildren: './pages/cards/cards.module#CardsModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
