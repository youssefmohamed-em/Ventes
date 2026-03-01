import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  email = '';
  password = '';
  loginSuccess$ = new Subject<void>();
  loginSuccess = signal(false);
  token = signal<string | null>(localStorage.getItem('token'));

  login() {
    return this.http.post<{ access_token: string }>(
      'https://api-dev.cashfloweg.com/auth/login',
      { username: this.email, password: this.password }
    ).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        // ✅ احفظ credentials للـ re-login
        localStorage.setItem('_u', btoa(this.email));
        localStorage.setItem('_p', btoa(this.password));
        this.token.set(res.access_token);
        this.loginSuccess.set(true);
        setTimeout(() => {
          this.router.navigateByUrl('/layout/dashboard').then(() => {
            this.loginSuccess$.next();
          });
        }, 300);
      },
      error: () => alert('Wrong credentials!')
    });
  }

  // ✅ re-login تلقائي
  refreshToken(): Observable<any> {
    const u = localStorage.getItem('_u');
    const p = localStorage.getItem('_p');

    if (!u || !p) {
      this.logout();
      return new Observable(obs => obs.error('No credentials'));
    }

    return this.http.post<{ access_token: string }>(
      'https://api-dev.cashfloweg.com/auth/login',
      { username: atob(u), password: atob(p) }
    ).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access_token);
        this.token.set(res.access_token);
      })
    );
  }

  logout() {
    this.token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('_u');
    localStorage.removeItem('_p');
    this.router.navigateByUrl('/login');
  }

  isLoggedIn() { return !!this.token(); }

  getToken(): string | null { return this.token(); }

  getUserName(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).name : '';
  }
}