import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
    email = '';
  password = '';

   login(){
    this.auth.email= this.email;
    this.auth.password= this.password;
    this.auth.login()
   }
}

