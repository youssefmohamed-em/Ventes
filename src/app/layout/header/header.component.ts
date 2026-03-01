import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { MerchantService } from '../../services/merchant.service';
import { AnalyticsService } from '../../services/analytics.service';
import { Merchant } from '../../interfaces/merchant';
import { filter } from 'rxjs';
import { MerchantfilterService } from '../../services/merchantfilter.service';
@Component({
  selector: 'app-header',
  imports: [ButtonModule, CommonModule, TranslateModule, FormsModule, Select],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  username = '';
  isDashboard = false;

  merchants: Merchant[] = [];
  selectedMerchant: Merchant | null = null;

  @Output() openSidebar = new EventEmitter<void>();
  @Output() merchantChanged = new EventEmitter<Merchant>();

  auth = inject(AuthService);
  private merchantService = inject(MerchantService);
  private router = inject(Router);
 private merchantfilter = inject ( MerchantfilterService)
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.username = this.auth.getUserName();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      this.isDarkMode = true;
    } else {
      this.isDarkMode = document.documentElement.classList.contains('dark');
    }
if (this.merchants.length > 0) {
  this.selectedMerchant = this.merchants[0];
  this.merchantfilter.setSelectedMerchant(this.selectedMerchant.code);
}
    // تحقق من الـ route الحالي
    this.isDashboard = this.router.url.includes('dashboard');

    // اتابع تغيير الـ route
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.isDashboard = e.url.includes('dashboard');
    });

    // جيب الـ merchants لو في dashboard
    this.merchantService.getMerchants(0, 100).subscribe({
      next: (res) => {
        this.merchants = res.content;
        if (this.merchants.length > 0) {
          this.selectedMerchant = this.merchants[0];
          this.merchantChanged.emit(this.selectedMerchant);
        }
      }
    });
  }

 onMerchantChange(): void {
  if (this.selectedMerchant) {
    this.merchantfilter.setSelectedMerchant(this.selectedMerchant.code);
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