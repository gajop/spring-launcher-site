import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { GameListComponent } from './game/game-list/game-list.component';
import { GameAddComponent } from './game/game-add/game-add.component';

const routes: Routes = [
  // { path: '', component: GameListComponent },
  { path: '', component: GameListComponent },
  { path: 'game/add', component: GameAddComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'auth/github/callback', component: AuthComponent },
  // { path: 'auth/github', component: GithubAuthComponent },
  // { path: 'edit/:postId', component: PostCreateComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
