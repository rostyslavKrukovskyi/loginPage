import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  // loading = false;
  users?: User[];

  constructor(private userService: UserService) {}

  ngOnInit() {
    // this.loading = true;
    this.userService
      .getAll()
      .pipe(first())
      .subscribe((users) => {
        // this.loading = false;
        this.users = users;
      });
  }
}
