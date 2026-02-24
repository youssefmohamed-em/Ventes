import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Merchant, MerchantResponse } from '../interfaces/merchant';


@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  
  private http = inject (HttpClient);
  private baseUrl = 'https://api-dev.cashfloweg.com/secure/onboarding/api';
  constructor() { }
  
  getMerchants(page: number = 0, size: number = 10, search:string = ''): Observable<MerchantResponse> {
    const url = `${this.baseUrl}/merchant/${search} /${page}/${size}`;
    return this.http.get<MerchantResponse>(url);
  }
}
