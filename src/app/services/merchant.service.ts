import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MerchantResponse } from '../interfaces/merchant';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  private http = inject(HttpClient);
  private baseUrl = 'https://api-dev.cashfloweg.com/secure/onboarding/api';

  getMerchants(
    page: number = 0,
    size: number = 10,
    search: string = ''
  ): Observable<MerchantResponse> {

    const trimmed = (search ?? '').trim();

    const searchSegment =
      trimmed.length === 0
        ? '%20'
        : encodeURIComponent(trimmed.toLowerCase());

    const url = `${this.baseUrl}/merchant/${searchSegment}/${page}/${size}`;

    return this.http.get<MerchantResponse>(url);
  }
}