import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';

import {faGithub} from '@fortawesome/free-brands-svg-icons';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loaded = true;
  faGithub = faGithub;

  constructor(public http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const queryParams = this.activatedRoute.snapshot.queryParams;
      const code = queryParams.code;
      const state = queryParams.state;
      if (code && state) {
        this.authService.validate(code, state);
      }
    });
  }

  onAuthGithub() {
    this.loaded = false;
    this.authService.authGithub();
  }


}
