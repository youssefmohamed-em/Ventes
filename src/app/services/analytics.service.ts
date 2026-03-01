// src/app/services/analytics.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsResponse } from '../interfaces/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private http = inject(HttpClient);
  private baseUrl = 'https://api-dev.cashfloweg.com/secure/merchant-portal/api/admin';

  getOrderAnalytics(
    merchantCode: string,
    granularity: 'day' | 'month' | 'year' = 'year'
  ): Observable<AnalyticsResponse> {
    return this.http.post<AnalyticsResponse>(
      `${this.baseUrl}/order/analytics`,
      { merchantCode, granularity }
    );
  }
}