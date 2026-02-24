import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }
  private config = inject(ConfigService)
  private  http = inject(HttpClient)

  searchOrders(merchantCode: string, page: number, size: number) {
}

}
