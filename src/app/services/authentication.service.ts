import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(userName: string, password: string) {
    console.log(userName, password, 'from auth service');
    return this.http
      .post<any>(
        `${environment.apiUrl}/users/authenticate`,
        { userName, password },
        { withCredentials: true }
      )
      .pipe(
        map((user) => {
          alert('sadfsdf');
          this.userSubject.next(user);
          this.startRefreshTokenTimer();
          console.log(user, ' user!!!!!!');
          return user;
        })
      );
  }

  logout() {
    this.http
      .post<any>(
        `${environment.apiUrl}/users/revoke-token`,
        {},
        { withCredentials: true }
      )
      .subscribe();
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiUrl}/users/refresh-token`,
        {},
        { withCredentials: true }
      )
      .pipe(
        map((user) => {
          console.log(user, ' from refresh token responce');
          alert('refresh token works');
          this.userSubject.next(user);
          this.startRefreshTokenTimer();
          return user;
        })
      );
  }

  // helper methods

  private refreshTokenTimeout?: NodeJS.Timeout;

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtBase64 = this.userValue!.jwtToken!.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = 130000;
    // const timeout = expires.getTime() - Date.now() - 60 * 1000;
    // console.log(timeout, ' @@@@@ timeout');
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
