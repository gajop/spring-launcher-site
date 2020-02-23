import { Component, OnInit } from '@angular/core';

import { faGithub, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

import { Game } from 'src/app/game/game.model';
import { GameService } from 'src/app/game/game.service';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css']
})
export class RepoListComponent implements OnInit {
  games: Game[] = [];
  loaded = false;

  faGithub = faGithub;
  faLinux = faLinux;
  faWindows = faWindows;
  faCalendarAlt = faCalendarAlt;

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.gameService.getAllRepos().subscribe(games => {
      this.games = games;
      this.loaded = true;
    });
  }

  getGameBuildTime(game: Game): Date {
    if (game.builds.length === 0) {
      return;
    }
    return game.builds[game.builds.length - 1].build_info.created_time;
  }

  getGameAvatarLink(game: Game) {
    return `https://github.com/${game.full_name.split('/')[0]}.png?size=32`
  }
}
