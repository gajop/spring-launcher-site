import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Game } from './game.model';

const REPO_URL = `${environment.apiUrl}/repos/`;

@Injectable({providedIn: 'root'})
export class GameService {
  constructor(public http: HttpClient) {}

  getAvailableRepos() {
    return this.http.get<{message: string}>(`${REPO_URL}/available`);
  }

  getAllRepos() {
    return this.http.get<Game[]>(REPO_URL).pipe(
      map((games: Game[]) => {
        for (const game of games) {
          console.log(game);
          if (game.download_links !== null) {
            for (const downloadLink of game.download_links) {
              downloadLink.link = `${environment.dlUrl}${downloadLink.link}`;
            }
          }
        }
        return games;
      })
    );
  }

  getRepo(fullName: string) {
    return this.getAllRepos().pipe(
      map((games: Game[]) => {
        for (const game of games) {
          if (game.full_name === fullName) {
            return game;
          }
        }
        return null;
      })
    );
  }
}
