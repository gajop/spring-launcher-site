import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { GameListComponent } from './game/game-list/game-list.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { GameAddComponent } from './game/game-add/game-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RepoListComponent } from './repo/repo-list/repo-list.component';
import { RepoComponent } from './repo/repo/repo.component';
import { MaxLengthPipe } from './max-length.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    GameListComponent,
    GameAddComponent,
    RepoListComponent,
    RepoComponent,
    MaxLengthPipe,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
