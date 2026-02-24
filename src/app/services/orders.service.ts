import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private apiUrl = `${this.config.getbaseurl()}/secure/system/api/admin/order`;

  searchOrders(
    page: number = 0,
    size: number = 10,
    filters: any = {}
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // إضافة كل الفلاتر لو موجودة
  Object.keys(filters).forEach(key => {
  const value = filters[key];
  if (value !== null && value !== undefined && value !== '') {
    if (Array.isArray(value)) {
      params = params.set(key, value.join(',')); // لو array حوّله لسلسلة
    } else {
      params = params.set(key, value);
    }
  }
});

    return this.http.get(`${this.apiUrl}/search`, { params });
  }
}