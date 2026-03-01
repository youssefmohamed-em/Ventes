import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
  private messageService = inject(MessageService);

  email = '';
  password = '';
  isLoading = signal(false);

  login() {
    this.isLoading.set(true);
    this.auth.email = this.email;
    this.auth.password = this.password;

   const sub = this.auth.login();
   if( sub.closed) return; 


    this.messageService.add({
    severity: 'success',
    summary: 'Welcome back!',
    detail: 'Login successful',
    life: 1500
  });
    sub.add(() => this.isLoading.set(false));
  }
}