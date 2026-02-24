import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  username = '';

  @Output() openSidebar = new EventEmitter<void>();

  auth = inject(AuthService);

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.username = this.auth.getUserName();

    // تطبيق الثيم المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      this.isDarkMode = true;
    } else {
      this.isDarkMode = document.documentElement.classList.contains('dark');
    }
  }

  logout() {
    this.auth.logout();
  }

  toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    this.isDarkMode = isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}