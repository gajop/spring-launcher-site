import { Component, OnInit } from '@angular/core';

import { User } from '../auth/user.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  public user: User = null;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authService.getUserUpdatedListener().subscribe((user: User) => {
      this.user = user;
    });
  }



}
