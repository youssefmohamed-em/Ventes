import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { TranslateModule ,TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-details',
  standalone: true,
  imports: [ChartModule, CommonModule ,TranslateModule],
  templateUrl: './chart-details.component.html',
  styleUrl: './chart-details.component.css'
})
export class ChartDetailsComponent implements OnInit {

  // signals
  type    = signal<'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar'>('line');
  color   = signal<'blue' | 'emerald' | 'violet' | 'rose'>('blue');
  title   = signal<string>('');
  subtitle = signal<string>('');
  data    = signal<any>(null);
  options = signal<any>(null);

  readonly labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  readonly values = [65, 59, 80, 81, 56, 72];

  // computed
  total   = computed(() => this.values.reduce((a, b) => a + b, 0));
  highest = computed(() => Math.max(...this.values));
  lowest  = computed(() => Math.min(...this.values));

  colorMap = {
    blue:    { border: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    emerald: { border: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    violet:  { border: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    rose:    { border: '#f43f5e', bg: 'rgba(244,63,94,0.12)'  },
  };

  badgeClass = computed(() => {
    const map = {
      blue:    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      violet:  'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
      rose:    'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    };
    return map[this.color()];
  });

  iconBgClass = computed(() => {
    const map = {
      blue:    'from-blue-400 to-indigo-500',
      emerald: 'from-emerald-400 to-teal-500',
      violet:  'from-violet-400 to-pink-500',
      rose:    'from-rose-400 to-orange-400',
    };
    return map[this.color()];
  });

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.type.set((this.route.snapshot.paramMap.get('type') as any) || 'line');
    this.color.set((this.route.snapshot.paramMap.get('color') as any) || 'blue');
    this.title.set(this.route.snapshot.paramMap.get('title') || '');
    this.subtitle.set(this.route.snapshot.paramMap.get('subtitle') || '');

    const c = this.colorMap[this.color()];

    this.data.set({
      labels: this.labels,
      datasets: [{
        label: this.title(),
        data: this.values,
        fill: true,
        borderColor: c.border,
        backgroundColor: c.bg,
        tension: 0.4,
        pointBackgroundColor: c.border,
        pointRadius: 5,
        pointHoverRadius: 9,
        borderWidth: 2.5,
      }]
    });

    this.options.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#94a3b8',
          bodyColor: '#f1f5f9',
          padding: 12,
          cornerRadius: 12,
        }
      },
      scales: ['doughnut', 'pie', 'radar'].includes(this.type())
        ? {}
        : {
            x: {
              ticks: { color: '#94a3b8', font: { size: 11 } },
              grid: { color: 'rgba(148,163,184,0.1)' },
              border: { display: false }
            },
            y: {
              ticks: { color: '#94a3b8', font: { size: 11 } },
              grid: { color: 'rgba(148,163,184,0.1)' },
              border: { display: false }
            }
          }
    });
  }

  goBack() {
    this.router.navigate(['/layout/dashboard']);
  }
}