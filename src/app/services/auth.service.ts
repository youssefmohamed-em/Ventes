import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  email = '';
  password = '';

  // Token signal initialized from localStorage
  token = signal<string | null>(localStorage.getItem('token'));

  login() {
    return this.http.post<{ access_token: string }>(
      'https://api-dev.cashfloweg.com/auth/login',
      { username: this.email, password: this.password }
    ).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        this.token.set(res.access_token);
        this.router.navigateByUrl('/layout/dashboard');
      },
      error: () => alert('Wrong credentials!')
    });
  }

  logout() {
    this.token.set(null);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  isLoggedIn() {
    return !!this.token();
  }

  getToken(): string | null {
    // Always return latest token
    return this.token();
  }

    getUserName(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).name : '';
  }
}
