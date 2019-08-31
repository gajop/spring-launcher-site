import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Game } from './game.model';

const REPO_URL = `${environment.apiUrl}/repos/`;

@Injectable({providedIn: 'root'})
export class GameService {


  constructor(public http: HttpClient,
              private router: Router) {}

  getAvailableRepos() {
    return this.http.get<{message: string}>(`${REPO_URL}/available`);
  }

  getAllRepos() {
    return this.http.get<Game[]>(REPO_URL);
  }
}
