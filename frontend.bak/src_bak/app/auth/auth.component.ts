import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoading = false;

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
    this.isLoading = true;
    this.authService.authGithub();
  }


}
