import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthComponent } from './auth/auth.component';
import { GameAddComponent } from './game/game-add/game-add.component';
import { GameListComponent } from './game/game-list/game-list.component';
import { GameComponent } from './game/game/game.component';
import { HeaderComponent } from './header/header.component';
import { RepoListComponent } from './repo/repo-list/repo-list.component';
import { RepoComponent } from './repo/repo/repo.component';
import { MaxLengthPipe } from './util/max-length.pipe';
import { UserFriendlyDatePipe } from './util/user-friendly-date.pipe';
import { UserFriendlyTimespanPipe } from './util/user-friendly-timespan.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    GameListComponent,
    GameComponent,
    GameAddComponent,
    RepoListComponent,
    RepoComponent,
    MaxLengthPipe,
    UserFriendlyDatePipe,
    UserFriendlyTimespanPipe
  ],
  imports: [
    AppRoutingModule, BrowserModule, BrowserAnimationsModule, NgbModule,
    HttpClientModule, FontAwesomeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
