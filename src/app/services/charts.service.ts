import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor(private http: HttpClient, ) { }

  private apiurl='https://api-dev.cashfloweg.com/secure/merchant-portal/api/admin/order/analytics';

  getordercharts(merchantCode:string,granularity: string = 'month'): Observable<any> {
    const url = `${this.apiurl}?merchantCode=${merchantCode}`;
    const body = {granularity};
    return this.http.post(url,{granularity})

  }
}
