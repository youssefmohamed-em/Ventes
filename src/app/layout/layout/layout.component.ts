import { Component, ViewChild, OnInit, inject, effect } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProgressSpinnerModule, ProgressSpinner } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [SidebarComponent, HeaderComponent, CommonModule, RouterModule, ToastModule],
})
export class LayoutComponent implements OnInit {
  loadingservices = inject(LoadingService);
  private auth = inject(AuthService);
  private messageService = inject(MessageService);

  @ViewChild('sidebar') sidebar!: SidebarComponent;

  currentDir: 'ltr' | 'rtl' = 'ltr';

  constructor(private translate: TranslateService, private router: Router) {
    effect(() => {
      if (this.auth.loginSuccess()) {
        this.messageService.add({
          severity: 'success',
          summary: 'Welcome back!',
          detail: 'Login successful',
          life: 3000
        });
        this.auth.loginSuccess.set(false);
      }
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.use(savedLang);
    this.currentDir = savedLang === 'ar' ? 'rtl' : 'ltr';

    this.translate.onLangChange.subscribe(({ lang }) => {
      this.currentDir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('lang', lang);
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingservices.isloading.set(true);
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingservices.isloading.set(false);
      }
    });
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.currentDir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  toggleSidebar() {
    this.sidebar.mobileOpen.set(!this.sidebar.mobileOpen());
  }
}