import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { AUTH_TOKEN_KEY, LOGIN_ERROR_CODES, UNSUCCESSFUL_LOGIN } from '../constants/auth.constants';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) {
  }

  login({ email, password }: { email: string; password: string }) {
    return this.http
      .post<{ accessToken: string, }>('/api/login', { email, password })
      .pipe(
        catchError(this.handleLoginError.bind(this)),
        map(this.setSessionIfSuccessfulLogin.bind(this)),
        tap(this.navigateToDashboardIfSuccessfulLogin.bind(this)),
        shareReplay()
      );
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  logout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  setSessionIfSuccessfulLogin(result: { accessToken: string, }): boolean {
    this.removeSession();
    if (result.accessToken) {
      this.setSession(result);
      return true;
    }
    return false;
  }

  private handleLoginError(error): Observable<{ accessToken: string, }> {
    if (LOGIN_ERROR_CODES.has(error.status)) {
      return of(UNSUCCESSFUL_LOGIN);
    }
    throw error;
  }

  private navigateToDashboardIfSuccessfulLogin(isSuccessfulLogin: boolean): void {
    if (isSuccessfulLogin) {
      this.router.navigate(['admin/dashboard']);
    }
  }

  private removeSession(): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }

  private setSession(result: { accessToken: string, }): void {
    sessionStorage.setItem(AUTH_TOKEN_KEY, result.accessToken);
  }
}
