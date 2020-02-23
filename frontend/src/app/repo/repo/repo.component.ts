import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faGithub, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

import { Build, Game } from 'src/app/game/game.model';
import { GameService } from 'src/app/game/game.service';

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.css']
})
export class RepoComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute, private router: Router,
    private gameService: GameService) { }

  game: Game = null;
  loaded = false;

  faGithub = faGithub;
  faLinux = faLinux;
  faWindows = faWindows;
  faCalendarAlt = faCalendarAlt;
  faHistory = faHistory;

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const fullName = `${params['user']}/${params['repo']}`;
      this.gameService.getRepo(fullName).subscribe((game: Game) => {
        if (game == null) {
          this.router.navigate(['/repo']);
          return;
        }
        this.game = game;
        this.loaded = true;
      });
    });
  }

  getGameAvatarLink() {
    return `https://github.com/${
      this.game.full_name.split('/')[0]}.png?size=200`;
  }

  getUserAvatarLink(username: string) {
    return `https://github.com/${username}.png?size=24`;
  }

  getGameBuildTime(): Date {
    if (this.game.builds.length === 0) {
      return;
    }
    return this.game.builds[this.game.builds.length - 1]
      .build_info.created_time;
  }

  getGameRepoNamePart(): string {
    return this.game.full_name.split('/')[1];
  }

  buildsByNewest(): Build[] {
    return this.game.builds.slice().reverse();
  }
}
