import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class GameService {


  constructor(public http: HttpClient,
              private router: Router) {}

  getAvailableRepos() {
    this.http.get<{message: string}>(
      'http://localhost:3000/api/games/available').subscribe(res => {
    });
  }

}
