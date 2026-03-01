import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardsComponent } from "../../shared/shared/components/cards/cards.component";
import { ChartsComponent } from "../../shared/shared/components/charts/charts.component";
import { TranslateModule } from '@ngx-translate/core';
import { MerchantService } from '../../services/merchant.service';
import { AnalyticsService } from '../../services/analytics.service';
import { Merchant } from '../../interfaces/merchant';
import { AnalyticsResponse } from '../../interfaces/analytics';
import { Select } from 'primeng/select';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardsComponent, ChartsComponent, TranslateModule, Select],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  merchants: Merchant[] = [];
  selectedMerchant: Merchant | null = null;
  analytics: AnalyticsResponse | null = null;
  loading = false;

  constructor(
    private merchantService: MerchantService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.merchantService.getMerchants(0, 100).subscribe({
      next: (res) => {
        this.merchants = res.content;
        if (this.merchants.length > 0) {
          this.selectedMerchant = this.merchants[0];
          this.loadAnalytics(this.selectedMerchant.code);
        }
      }
    });
  }

  onMerchantChange(): void {
    if (this.selectedMerchant) {
      this.loadAnalytics(this.selectedMerchant.code);
    }
  }

  loadAnalytics(merchantCode: string): void {
    this.loading = true;
    this.analyticsService.getOrderAnalytics(merchantCode).subscribe({
      next: (res) => { this.analytics = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get paidValue(): string {
    return this.analytics ? `${this.analytics.kpis.paid_value.toLocaleString()} ${this.analytics.currency}` : '-';
  }

  get paidOrders(): string {
    return this.analytics ? `${this.analytics.kpis.paid_orders}` : '-';
  }
}