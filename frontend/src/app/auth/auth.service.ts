import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { User } from './user.model';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class AuthService {
  private user: User = null;
  private userUpdated = new Subject<User>();

  private jwtToken: string;
  private tokenTimer: any;
  private isAuthenticated = false;

  constructor(public http: HttpClient,
              private router: Router) {}


  getUserUpdatedListener() {
    return this.userUpdated.asObservable();
  }

  updateUserInfo() {
    this.http.get<{nick: string, github_nick: string,
                    github_avatar_url: string,
                    github_access_token: string}>(
      `${API_URL}/user`).subscribe(res => {
        this.user = {
          nick: res.nick,
          github_nick: res.github_nick,
          github_avatar_url: res.github_avatar_url,
          github_access_token: res.github_access_token
        };
        this.userUpdated.next(this.user);
      });
  }

  getToken() {
    return this.jwtToken;
  }

  logout() {
    this.jwtToken = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.user = null;
    this.userUpdated.next(null);
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }

    const now = new Date();
    if (now >= authInfo.expirationDate) {
      return;
    }

    this.jwtToken = authInfo.jwtToken;
    this.isAuthenticated = true;
    this.updateUserInfo();
    this.setAuthTimer(authInfo.expirationDate.getTime() - now.getTime());
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('jwtTokenExpirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtTokenExpirationDate');
  }

  private getAuthData() {
   const jwtToken = localStorage.getItem('jwtToken');
   const jwtTokenExpirationDate = localStorage.getItem('jwtTokenExpirationDate');
   if (!jwtToken || !jwtTokenExpirationDate) {
     return;
   }
   return {
     jwtToken,
     expirationDate: new Date(jwtTokenExpirationDate)
   };
  }

  validate(code: string, state: string) {
    this.http.post<{token: string, expiresIn: number}>(
      `${API_URL}/github/auth/validate`,
      { code })
      .subscribe(res => {
        this.jwtToken = res.token;
        if (!this.jwtToken) {
          console.log('Missing jwtToken');
          return;
        }

        this.isAuthenticated = true;
        const expiresIn = res.expiresIn;
        this.setAuthTimer(expiresIn * 1000);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);

        this.saveAuthData(this.jwtToken, expirationDate);
        this.updateUserInfo();
        this.router.navigate(['/']);
      }, error => {
        console.log('error', error);
        this.router.navigate(['/auth']);
      });
  }

  authGithub() {
    this.http.get<{client_id: string, scopes: string, state: string}>(
      `${API_URL}/github/auth/token`).
      subscribe(res => {
        const client_id = res.client_id;
        const scopes = res.scopes;
        const state = res.state;

        window.location.href =
          `https://github.com/login/oauth/authorize?client_id=${client_id}&scopes=${scopes}&state=${state}`;
      });
  }
}
