import { Component, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment";

import { GameService } from "../game.service";
import { Game } from "../game.model";

import {
  faGithub,
  faLinux,
  faWindows
} from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"]
})
export class GameListComponent implements OnInit {
  games: Game[] = [];
  loaded = false;

  faGithub = faGithub;
  faLinux = faLinux;
  faWindows = faWindows;

  constructor(public gameService: GameService) {}

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
}
