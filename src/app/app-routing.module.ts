import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { GameComponent } from './game/game.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'new', component: NewComponent },
  { path: 'game', component: GameComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'join', redirectTo: '/new', pathMatch: 'prefix' },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot (routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
