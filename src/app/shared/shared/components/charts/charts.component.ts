import { Component, OnInit, Input, signal, computed, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChartsService } from '../../../../services/charts.service';
import { MerchantfilterService } from '../../../../services/merchantfilter.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  constructor(private router: Router, private chartService: ChartsService) {}
  private merchantFilter = inject(MerchantfilterService);

  @Input() title: string = 'Sales Overview';
  @Input() subtitle: string = 'Last 6 months';
  @Input() color: 'blue' | 'emerald' | 'violet' | 'rose' = 'blue';
  @Input() type: 'line' | 'bar' | 'radar' | 'doughnut' = 'line';

  // signals
  data = signal<any>(null);
  options = signal<any>(null);
  trend = signal<number>(0);
  range = signal<'day' | 'month' | 'year'>('month');

  labels = signal<string[]>([]);
  paidData = signal<number[]>([]);
  refundData = signal<number[]>([]);
  expiredData = signal<number[]>([]);

  // computed
  trendPositive = computed(() => this.trend() >= 0);
  trendText     = computed(() => (this.trendPositive() ? '+' : '') + this.trend());

  borderClass = computed(() => {
    const map = {
      blue:    'border-blue-200 dark:border-blue-800',
      emerald: 'border-emerald-200 dark:border-emerald-800',
      violet:  'border-violet-200 dark:border-violet-800',
      rose:    'border-rose-200 dark:border-rose-800',
    };
    return map[this.color];
  });

  hoverGradient = computed(() => {
    const map = {
      blue:    'from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-cyan-950/40',
      emerald: 'from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-cyan-950/40',
      violet:  'from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/40 dark:via-purple-950/40 dark:to-pink-950/40',
      rose:    'from-rose-50 via-red-50 to-orange-50 dark:from-rose-950/40 dark:via-red-950/40 dark:to-orange-950/40',
    };
    return map[this.color];
  });

  decCircle1 = computed(() => {
    const map = {
      blue: 'bg-blue-400',
      emerald: 'bg-emerald-400',
      violet: 'bg-violet-400',
      rose: 'bg-rose-400'
    };
    return map[this.color];
  });

  iconBgClass = computed(() => {
    const map = {
      blue:    'from-blue-400 to-indigo-500',
      emerald: 'from-emerald-400 to-teal-500',
      violet:  'from-violet-400 to-pink-500',
      rose:    'from-rose-400 to-orange-400',
    };
    return map[this.color];
  });

  glowClass = computed(() => {
    const map = {
      blue: 'bg-blue-400',
      emerald: 'bg-emerald-400',
      violet: 'bg-violet-400',
      rose: 'bg-rose-400',
    };
    return map[this.color];
  });

  trendClass = computed(() => {
    if (this.trendPositive()) {
      return 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400';
    }
    return 'text-red-500 border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400';
  });

  colorMap = {
    blue:    { border: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    emerald: { border: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    violet:  { border: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    rose:    { border: '#f43f5e', bg: 'rgba(244,63,94,0.12)' },
  };

  ngOnInit() {
    // اشترك في تغيير الـ merchant
    this.merchantFilter.selectedMerchant$.subscribe(code => {
      if (code) this.loadChart(code);
    });
    this.setOptions();
  }

  loadChart(merchantCode: string = '') {
    const c = this.colorMap[this.color];

    this.chartService.getordercharts(merchantCode, this.range()).subscribe({
      next: (res: any) => {
        const labels = res.buckets.map((b: any) => b.label);
        const paid = res.buckets.map((b: any) => b.byStatus.All.paid.value);
        const refund = res.buckets.map((b: any) => b.byStatus.All.refund.value);
        const expired = res.buckets.map((b: any) => b.byStatus.All.expired.value);

        this.labels.set(labels);
        this.paidData.set(paid);
        this.refundData.set(refund);
        this.expiredData.set(expired);

        this.trend.set(paid[paid.length - 1] - paid[paid.length - 2]);

        this.data.set({
          labels,
          datasets: [
            { label: 'Paid',    data: paid,    borderColor: c.border, backgroundColor: c.bg, fill: true, tension: 0.4 },
            { label: 'Refund',  data: refund,  borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.12)', fill: true, tension: 0.4 },
            { label: 'Expired', data: expired, borderColor: '#9ca3af', backgroundColor: 'rgba(156,163,175,0.12)', fill: true, tension: 0.4 }
          ]
        });
      },
      error: (err: any) => console.error(err)
    });
  }

  changeRange(range: 'day' | 'month' | 'year') {
    this.range.set(range);
    this.loadChart();
  }

  setOptions() {
    const c = this.colorMap[this.color];
    this.options.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: { backgroundColor: '#1e293b', titleColor: '#94a3b8', bodyColor: '#f1f5f9', padding: 12, cornerRadius: 12 }
      },
      scales: ['doughnut', 'pie', 'radar'].includes(this.type) ? {} : {
        x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(148,163,184,0.1)' }, border: { display: false } },
        y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(148,163,184,0.1)' }, border: { display: false } }
      }
    });
  }

  goToDetails() {
    this.router.navigate(['/layout/chartDetails', this.type, this.color, this.title, this.subtitle]);
  }
}