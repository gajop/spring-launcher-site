import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {faGithub, faLinux, faWindows} from '@fortawesome/free-brands-svg-icons';
import {Game} from 'src/app/game/game.model';
import {GameService} from 'src/app/game/game.service';

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.css']
})
export class RepoComponent implements OnInit {
  constructor(
      private activatedRoute: ActivatedRoute, private router: Router,
      private gameService: GameService) {}

  game: Game = null;
  loaded = false;

  faGithub = faGithub;
  faLinux = faLinux;
  faWindows = faWindows;

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

  getGameBuildTime(game: Game): Date {
    if (game.builds.length === 0) {
      return;
    }
    return game.builds[game.builds.length - 1].build_info.created_time;
  }
}
